import io
import json
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent))
import deploy
from package import package

REVISION = 'a' * 40


def raw_archive(entries):
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode='w:gz', format=tarfile.USTAR_FORMAT) as archive:
        for member, data in entries:
            archive.addfile(member, io.BytesIO(data) if data is not None else None)
    return output.getvalue()


def file_entry(name, data=b'x', mode=0o644):
    member = tarfile.TarInfo(name)
    member.size = len(data)
    member.mode = mode
    return member, data


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.dist = self.root / 'dist'
        (self.dist / 'assets').mkdir(parents=True)
        (self.dist / 'index.html').write_text('<html>China</html>')
        (self.dist / deploy.PDF).write_bytes(b'%PDF-test')
        (self.dist / 'assets/index-abcdefgh.js').write_text('export {};')
        (self.dist / 'assets/index-abcdefgh.css').write_text('body {}')
        self.payload, self.manifest = package(self.dist, REVISION)
        self.base = self.root / 'server'
        self.previous = self.base / 'releases' / 'previous'
        (self.previous / 'public/assets').mkdir(parents=True)
        (self.previous / 'public/index.html').write_text('old site')
        (self.previous / 'public/assets/index-previous.js').write_text('old script')
        (self.previous / 'public/assets/unhashed.js').write_text('do not retain')
        (self.base / 'current').symlink_to(self.previous)

    def entries(self):
        with tarfile.open(fileobj=io.BytesIO(self.payload), mode='r:gz') as archive:
            return [(member, archive.extractfile(member).read()) for member in archive]

    def test_round_trip_and_atomic_activation(self):
        calls = []
        def health(revision, index_sha):
            active = (self.base / 'current').resolve() / 'public'
            self.assertEqual(json.loads((active / 'release.json').read_text()), {'revision': revision})
            self.assertEqual(deploy.digest((active / 'index.html').read_bytes()), index_sha)
            calls.append(revision)
        receipt = deploy.deploy(self.payload, REVISION, self.base, health)
        active = (self.base / 'current').resolve()
        self.assertEqual(calls, [REVISION])
        self.assertEqual(receipt['previousRelease'], 'previous')
        self.assertTrue((active / 'public/assets/index-previous.js').exists())
        self.assertFalse((active / 'public/assets/unhashed.js').exists())
        self.assertFalse((active / 'public/manifest.json').exists())
        self.assertEqual((active / 'public/index.html').stat().st_mode & 0o777, 0o644)
        self.assertEqual(active.stat().st_mode & 0o777, 0o755)
        self.assertEqual((self.previous / 'public/index.html').read_text(), 'old site')
        repeated = deploy.deploy(self.payload, REVISION, self.base, health)
        self.assertNotEqual(receipt['release'], repeated['release'])

    def test_failed_health_rolls_back(self):
        def failed(*_):
            raise RuntimeError('origin unavailable')
        with self.assertRaisesRegex(RuntimeError, 'origin unavailable'):
            deploy.deploy(self.payload, REVISION, self.base, failed)
        self.assertEqual((self.base / 'current').resolve(), self.previous)
        self.assertEqual((self.previous / 'public/index.html').read_text(), 'old site')

    def test_invalid_archive_never_changes_current(self):
        entries = self.entries() + [file_entry('../outside.html')]
        with self.assertRaises(ValueError):
            deploy.deploy(raw_archive(entries), REVISION, self.base, lambda *_: None)
        self.assertEqual((self.base / 'current').resolve(), self.previous)
        self.assertFalse((self.base / 'outside.html').exists())

    def test_forbidden_paths(self):
        for name in ['../index.html', '/index.html', 'assets/../index.js', './index.html',
                     '.env', 'src/main.ts', 'assets/source.js.map', 'nginx.conf',
                     'photos/.hidden.webp', 'assets/a/b.js', 'release.json/child.js',
                     'places/../index.html', 'places/a/b/index.html', 'places/a/script.js',
                     'places/.hidden/index.html', 'places/a--b/index.html']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                deploy.validate_archive(raw_archive(self.entries() + [file_entry(name)]), REVISION)

    def test_destination_pages_round_trip(self):
        for name in ['places/index.html', 'places/jiuzhaigou/index.html', 'places/blue-moon-valley/index.html']:
            target = self.dist / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('<html>Destination guide</html>')
        payload, _ = package(self.dist, REVISION)
        deploy.deploy(payload, REVISION, self.base, lambda *_: None)
        self.assertEqual((self.base / 'current/public/places/jiuzhaigou/index.html').read_text(), '<html>Destination guide</html>')

    def test_links_directories_and_executables(self):
        for member_type in [tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.DIRTYPE, tarfile.FIFOTYPE]:
            member = tarfile.TarInfo('assets/link.js')
            member.type = member_type
            member.linkname = '/etc/passwd'
            with self.subTest(type=member_type), self.assertRaises(ValueError):
                deploy.validate_archive(raw_archive(self.entries() + [(member, None)]), REVISION)
        with self.assertRaises(ValueError):
            deploy.validate_archive(raw_archive(self.entries() + [file_entry('assets/run.js', mode=0o755)]), REVISION)

    def test_duplicate_unlisted_and_bad_checksum(self):
        cases = [self.entries() + [file_entry('index.html')],
                 self.entries() + [file_entry('assets/unlisted.js')]]
        altered = self.entries()
        altered = [file_entry(m.name, b'changed') if m.name == 'index.html' else (m, data) for m, data in altered]
        cases.append(altered)
        for entries in cases:
            with self.subTest(count=len(entries)), self.assertRaises(ValueError):
                deploy.validate_archive(raw_archive(entries), REVISION)

    def test_size_and_count_limits(self):
        with patch.object(deploy, 'MAX_COMPRESSED', 1), self.assertRaises(ValueError):
            deploy.validate_archive(self.payload, REVISION)
        with patch.object(deploy, 'MAX_EXPANDED', 128), self.assertRaises(ValueError):
            deploy.validate_archive(self.payload, REVISION)
        with patch.object(deploy, 'MAX_FILES', 2), self.assertRaises(ValueError):
            deploy.validate_archive(self.payload, REVISION)

    def test_revision_mismatch_and_command_injection(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.payload, 'b' * 40)
        for command in ['', 'sh', 'deploy ' + REVISION + '; id', 'deploy ' + REVISION + '\n',
                        'deploy ../current', 'deploy ' + REVISION + ' extra']:
            with self.subTest(command=command), patch.dict('os.environ', {'SSH_ORIGINAL_COMMAND': command}), self.assertRaises(ValueError):
                deploy.main()

    def test_package_rejects_source_and_symlinks(self):
        source = self.dist / '.env'
        source.write_text('private')
        with self.assertRaises(ValueError):
            package(self.dist, REVISION)
        source.unlink()
        (self.dist / 'assets/link.js').symlink_to(self.dist / 'index.html')
        with self.assertRaises(ValueError):
            package(self.dist, REVISION)


if __name__ == '__main__':
    unittest.main()
