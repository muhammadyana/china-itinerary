#!/usr/bin/env python3
"""Package the tested dist tree and checksum manifest for the SSH receiver."""
import gzip
import io
import json
from pathlib import Path
import sys
import tarfile

from deploy import MANIFEST, allowed_path, digest, valid_revision, validate_archive


def package(dist, revision):
    valid_revision(revision)
    if not dist.is_dir() or dist.is_symlink():
        raise ValueError('Build dist/ before packaging')
    files = {}
    for path in sorted(dist.rglob('*')):
        if path.is_symlink():
            raise ValueError('Build cannot contain symlinks')
        if not path.is_file():
            continue
        name = path.relative_to(dist).as_posix()
        if not allowed_path(name) or name == 'release.json' or path.stat().st_mode & 0o111:
            raise ValueError(f'Forbidden build file: {name}')
        files[name] = path.read_bytes()
    files['release.json'] = (json.dumps({'revision': revision}) + '\n').encode()
    manifest = {'revision': revision, 'files': {name: digest(data) for name, data in files.items()}}
    files[MANIFEST] = (json.dumps(manifest, sort_keys=True, indent=2) + '\n').encode()
    output = io.BytesIO()
    with gzip.GzipFile(fileobj=output, mode='wb', filename='', mtime=0) as compressed:
        with tarfile.open(fileobj=compressed, mode='w', format=tarfile.USTAR_FORMAT) as archive:
            for name, data in sorted(files.items()):
                member = tarfile.TarInfo(name)
                member.size = len(data)
                member.mode = 0o644
                member.mtime = 0
                archive.addfile(member, io.BytesIO(data))
    payload = output.getvalue()
    validate_archive(payload, revision)
    return payload, manifest


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: python3 ops/package.py <commit SHA> <archive.tar.gz>')
    payload, manifest = package(Path('dist'), sys.argv[1])
    Path(sys.argv[2]).write_bytes(payload)
    print(json.dumps({'revision': sys.argv[1], 'files': len(manifest['files']),
                      'bytes': len(payload), 'sha256': digest(payload)}))
