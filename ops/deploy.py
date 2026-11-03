#!/usr/bin/env python3
"""Fixed-command SSH receiver for the China static site; never executes uploads."""
import fcntl
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from datetime import datetime, timezone
from uuid import uuid4

BASE = Path('/home/deploy/apps/china.muhammadyana.me')
DOMAIN = 'china.muhammadyana.me'
MAX_COMPRESSED = 64 * 1024 * 1024
MAX_EXPANDED = 100 * 1024 * 1024
MAX_FILES = 512
MANIFEST = 'manifest.json'
PDF = 'China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf'
HASHED_ASSET = re.compile(r'.+-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2)')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def valid_revision(revision):
    if not isinstance(revision, str) or not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('Revision must be a full lowercase Git commit SHA')
    return revision


def allowed_path(name):
    """Only the deployed site's static file locations, never host configuration."""
    if name in {'index.html', 'release.json', 'icons.svg', 'favicon.svg', PDF}:
        return True
    return bool(re.fullmatch(r'assets/[A-Za-z0-9_-]+\.(?:js|css|woff2)', name)
                or re.fullmatch(r'photos/[A-Za-z0-9_-]+\.(?:webp|avif)', name)
                or re.fullmatch(r'places/(?:[a-z0-9]+(?:-[a-z0-9]+)*/)?index\.html', name))


def read_bounded(stream, limit):
    data = stream.read(limit + 1)
    if len(data) > limit:
        raise ValueError('Deployment archive exceeds size limit')
    return data


def validate_archive(payload, revision):
    valid_revision(revision)
    if len(payload) > MAX_COMPRESSED:
        raise ValueError('Compressed archive exceeds size limit')
    with gzip.GzipFile(fileobj=io.BytesIO(payload)) as compressed:
        expanded = read_bounded(compressed, MAX_EXPANDED)
    files = {}
    with tarfile.open(fileobj=io.BytesIO(expanded), mode='r:') as archive:
        for member in archive:
            name = member.name
            if len(files) >= MAX_FILES:
                raise ValueError('Too many files')
            if (member.type not in (tarfile.REGTYPE, tarfile.AREGTYPE)
                    or member.sparse or member.pax_headers or member.mode & 0o7111):
                raise ValueError('Only ordinary, non-executable files are accepted')
            if name in files or (name != MANIFEST and not allowed_path(name)):
                raise ValueError('Duplicate or forbidden archive path')
            if member.size < 0 or member.size > MAX_EXPANDED:
                raise ValueError('Invalid member size')
            if name in {MANIFEST, 'release.json'} and member.size > 128 * 1024:
                raise ValueError('Metadata exceeds size limit')
            if name == 'index.html' and member.size > 2 * 1024 * 1024:
                raise ValueError('Index exceeds size limit')
            source = archive.extractfile(member)
            data = source.read(member.size + 1)
            if len(data) != member.size:
                raise ValueError('Incomplete archive member')
            files[name] = data
    try:
        manifest = json.loads(files.pop(MANIFEST))
        if set(manifest) != {'revision', 'files'} or manifest['revision'] != revision:
            raise ValueError('Manifest revision or schema mismatch')
        hashes = manifest['files']
        if not isinstance(hashes, dict) or set(hashes) != set(files):
            raise ValueError('Manifest must list every payload file exactly')
        if not {'index.html', 'release.json', PDF} <= files.keys():
            raise ValueError('Required site files are missing')
        for extension in ('.js', '.css'):
            if not any(name.startswith('assets/') and name.endswith(extension) for name in files):
                raise ValueError(f'Required {extension} asset is missing')
        if any(not isinstance(sha, str) or digest(files[name]) != sha for name, sha in hashes.items()):
            raise ValueError('Payload checksum mismatch')
        if json.loads(files['release.json']) != {'revision': revision}:
            raise ValueError('Release marker mismatch')
    except (KeyError, TypeError, json.JSONDecodeError) as error:
        raise ValueError('Invalid deployment metadata') from error
    return files, manifest


def origin_check(revision, index_sha):
    """Check this Nginx origin directly, preserving TLS hostname verification."""
    def fetch(path):
        return subprocess.check_output([
            '/usr/bin/curl', '--fail', '--silent', '--show-error', '--max-time', '15',
            '--noproxy', '*', '--resolve', f'{DOMAIN}:443:127.0.0.1',
            f'https://{DOMAIN}/{path}',
        ], timeout=20)
    if json.loads(fetch('release.json')) != {'revision': revision}:
        raise RuntimeError('Origin release marker does not match')
    if digest(fetch('index.html')) != index_sha:
        raise RuntimeError('Origin index does not match')


def point_current(base, target):
    temporary = base / f'.current-{uuid4().hex}'
    try:
        temporary.symlink_to(target)
        os.replace(temporary, base / 'current')
    finally:
        temporary.unlink(missing_ok=True)


def deploy(payload, revision, base=BASE, health_check=origin_check):
    """The base argument exists for isolated tests; SSH cannot override it."""
    os.umask(0o022)
    base = base.resolve(strict=True)
    releases = base / 'releases'
    releases.mkdir(exist_ok=True, mode=0o755)
    with (base / '.deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        files, manifest = validate_archive(payload, revision)
        current = base / 'current'
        if current.exists() and not current.is_symlink():
            raise RuntimeError('Current must be a release symlink')
        previous = current.resolve(strict=True) if current.is_symlink() else None
        if previous and (previous.parent != releases or not previous.is_dir()):
            raise RuntimeError('Previous release is outside the release directory')
        release_id = f'{revision[:12]}-{datetime.now(timezone.utc):%Y%m%dT%H%M%S%fZ}'
        release = releases / release_id
        with tempfile.TemporaryDirectory(prefix='.staging-', dir=releases) as staging:
            staged = Path(staging)
            public = staged / 'public'
            public.mkdir(mode=0o755)
            for name, data in files.items():
                target = public / name
                target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
                target.write_bytes(data)
                target.chmod(0o644)
            retained = []
            if previous:
                for old in (previous / 'public/assets').glob('*'):
                    target = public / 'assets' / old.name
                    if (old.is_file() and not old.is_symlink()
                            and HASHED_ASSET.fullmatch(old.name) and not target.exists()):
                        shutil.copyfile(old, target)
                        target.chmod(0o644)
                        retained.append(old.name)
            (staged / MANIFEST).write_text(json.dumps(manifest, indent=2) + '\n')
            staged.chmod(0o755)
            staged.rename(release)
        receipt = {
            'revision': revision, 'release': release_id,
            'previousRelease': previous.name if previous else None,
            'verifiedFiles': len(files), 'retainedAssets': retained,
            'originHttps': 'verified',
        }
        point_current(base, release)
        try:
            health_check(revision, manifest['files']['index.html'])
            (release / 'deployment.json').write_text(json.dumps(receipt, indent=2) + '\n')
        except Exception:
            # Do not undo a concurrent manual activation outside this lock.
            if current.resolve() == release:
                if previous:
                    point_current(base, previous)
                else:
                    current.unlink()
            raise
        return receipt


def main():
    command = os.environ.get('SSH_ORIGINAL_COMMAND', '')
    match = re.fullmatch(r'deploy ([0-9a-f]{40})', command)
    if not match:
        raise ValueError('Only deploy <full commit SHA> is permitted')
    payload = read_bounded(sys.stdin.buffer, MAX_COMPRESSED)
    print(json.dumps(deploy(payload, match[1]), indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Deployment failed: {error}', file=sys.stderr)
        sys.exit(1)
