# Static deployment protocol

Nginx serves `/home/deploy/apps/china.muhammadyana.me/current/public`. A release changes only that symlink; Nginx does not run the uploaded JavaScript or require a reload.

After a successful build and test run:

```sh
python3 ops/package.py "$GITHUB_SHA" site.tar.gz
ssh deploy@119.28.110.221 "deploy $GITHUB_SHA" < site.tar.gz
```

`package.py` includes the static `dist/` files, a generated `release.json` containing the full Git revision, and a checksum manifest. It refuses source files, secrets, executables and symlinks. The server independently validates the command, bounded gzip/tar sizes, paths, file types, manifest, revision and every checksum before activation.

Sharing images are allowed only as lowercase `social/<photo-id>.jpg` files directly in that directory; nested paths, other extensions and other directories are rejected. `social/jiuzhaigou.jpg` remains the homepage card, and each place page uses the card generated from its cover photo by `node ops/prepare-social-images.mjs` (requires ImageMagick). Update the installed receiver before deploying a release that contains a card other than `social/jiuzhaigou.jpg`.

The generated itinerary is allowed only at `China-Itinerary-8-21-November-2026.pdf`, with its static print page at `print/index.html`. The original `China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf` remains allowed for archived source and photo attribution. New builds include both PDFs and the print page. Other PDF filenames and files under `print/` are rejected; no general PDF or print-directory allowance is introduced.

Every release must contain `index.html`, `release.json`, JavaScript and CSS assets, and at least one of the two exact PDF filenames. The generated PDF and print page are optional for older releases, so existing packages and rollback targets remain compatible. Update the installed receiver before deploying a build containing either new path; the release upload cannot update that receiver itself.

## Server installation

Install `ops/deploy.py` as root-owned, non-writable-by-deploy `/usr/local/lib/china-itinerary-deploy.py` with mode `0644`. Add a **dedicated** Actions SSH public key to `deploy`'s `authorized_keys`, prefixed with:

```text
restrict,command="/usr/bin/python3 /usr/local/lib/china-itinerary-deploy.py" ssh-ed25519 <public-key> china-itinerary-actions
```

Keep existing keys intact. The dedicated key has no general shell, forwarding, PTY, or ability to choose a deployment directory. The handler uses fixed paths and curl arguments, performs no sudo operations, and never executes uploaded code. Store its private key only in GitHub's production environment secret and pin the server's independently verified SSH host key in the workflow.

## GitHub configuration

The `production` environment allows only the `main` branch. It contains secrets `DEPLOY_SSH_KEY` (the dedicated private key) and `DEPLOY_KNOWN_HOSTS` (the verified server host key), plus variables `DEPLOY_HOST=119.28.110.221` and `DEPLOY_USER=deploy`. These values are configured through GitHub; no credential belongs in this repository.

`.github/workflows/deploy.yml` tests pull requests without deployment credentials. A successful push or manual run on `main` uploads the tested artifact, invokes the restricted handler, and verifies the revision at public HTTPS `/release.json`. Actions are pinned to full commit SHAs. Builds use Node 24 and Playwright Chromium; local tests use installed Google Chrome.

The checked-in `nginx.conf` matches the active site: HTTP redirects to HTTPS, static assets are served from `current/public`, and the shared ACME webroot stays outside releases. Nginx configuration and certificate renewal are server administration tasks, not part of the upload protocol.

## Activation and recovery

The handler serializes deployments with a file lock, writes a fresh release, retains previous hashed CSS/JS/font assets for in-flight pages, and atomically switches `current`. A direct-origin HTTPS check verifies both `release.json` and the index hash. Failure restores the previous symlink; successful deployment prints a JSON receipt and saves it outside the public directory as `deployment.json`.

Rerunning a commit creates a distinct release. Old releases are never automatically deleted. A trusted administrator can roll back by atomically repointing `current` to a retained release; the restricted Actions key cannot execute an arbitrary rollback shell command. Do not modify the handler through the release payload: update the root-owned installed copy separately after reviewing changes to `ops/deploy.py`.

Run protocol tests locally with:

```sh
python3 -m unittest discover -s ops -p 'test_*.py' -v
```
