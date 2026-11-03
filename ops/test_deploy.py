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
GENERATED_PDF = 'China-Itinerary-8-21-November-2026.pdf'
PRINT_INDEX = 'print/index.html'


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
                     'places/.hidden/index.html', 'places/a--b/index.html',
                     'social/script.js', 'social/../index.html', 'social/.hidden.jpg',
                     'alternate.pdf', 'China-Itinerary-8-22-November-2026.pdf',
                     'print/extra.html', 'print/index.js', 'print/page/index.html',
                     'print/../index.html', 'print/index.html/child.html']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                deploy.validate_archive(raw_archive(self.entries() + [file_entry(name)]), REVISION)

    def test_original_pdf_release_remains_valid_without_print_page(self):
        files, _ = deploy.validate_archive(self.payload, REVISION)
        self.assertIn(deploy.PDF, files)
        self.assertNotIn(GENERATED_PDF, files)
        self.assertNotIn(PRINT_INDEX, files)

    def test_generated_pdf_and_print_page_round_trip(self):
        (self.dist / GENERATED_PDF).write_bytes(b'%PDF-generated-itinerary')
        print_page = self.dist / PRINT_INDEX
        print_page.parent.mkdir()
        print_page.write_text('<html>Current printable itinerary</html>')
        payload, _ = package(self.dist, REVISION)
        deploy.deploy(payload, REVISION, self.base, lambda *_: None)
        active = self.base / 'current/public'
        self.assertEqual((active / GENERATED_PDF).read_bytes(), b'%PDF-generated-itinerary')
        self.assertEqual((active / PRINT_INDEX).read_text(), '<html>Current printable itinerary</html>')
        self.assertEqual((active / deploy.PDF).read_bytes(), b'%PDF-test')

    def test_generated_pdf_can_satisfy_pdf_requirement_without_archive(self):
        (self.dist / deploy.PDF).unlink()
        (self.dist / GENERATED_PDF).write_bytes(b'%PDF-generated-itinerary')
        payload, _ = package(self.dist, REVISION)
        files, _ = deploy.validate_archive(payload, REVISION)
        self.assertIn(GENERATED_PDF, files)
        self.assertNotIn(deploy.PDF, files)

    def test_entrypoints_and_at_least_one_pdf_remain_required(self):
        for missing in ['index.html', 'release.json', deploy.PDF]:
            files = {member.name: data for member, data in self.entries()
                     if member.name not in {deploy.MANIFEST, missing}}
            files[PRINT_INDEX] = b'<html>Print page is not a PDF</html>'
            manifest = {'revision': REVISION,
                        'files': {name: deploy.digest(data) for name, data in files.items()}}
            entries = [file_entry(name, data) for name, data in files.items()]
            entries.append(file_entry(deploy.MANIFEST, json.dumps(manifest).encode()))
            with self.subTest(missing=missing), self.assertRaisesRegex(ValueError, 'Required site files are missing'):
                deploy.validate_archive(raw_archive(entries), REVISION)

    def test_destination_pages_round_trip(self):
        for name in ['places/index.html', 'places/jiuzhaigou/index.html', 'places/blue-moon-valley/index.html']:
            target = self.dist / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('<html>Destination guide</html>')
        payload, _ = package(self.dist, REVISION)
        deploy.deploy(payload, REVISION, self.base, lambda *_: None)
        self.assertEqual((self.base / 'current/public/places/jiuzhaigou/index.html').read_text(), '<html>Destination guide</html>')

    def test_social_image_round_trip(self):
        target = self.dist / 'social/jiuzhaigou.jpg'
        target.parent.mkdir()
        target.write_bytes(b'\xff\xd8\xff\xd9')
        payload, _ = package(self.dist, REVISION)
        deploy.deploy(payload, REVISION, self.base, lambda *_: None)
        self.assertEqual((self.base / 'current/public/social/jiuzhaigou.jpg').read_bytes(), target.read_bytes())

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
