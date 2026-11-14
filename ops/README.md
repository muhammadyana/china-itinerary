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

The checked-in `nginx.conf` matches the active site: HTTP redirects to HTTPS, static assets are served from `current/public`, and the shared ACME webroot stays outside releases. Its `/api/ask/` block is an inline copy of `ask/nginx-ask.conf`; on the server, `ask/install.sh` adds `include snippets/china-itinerary-ask.conf;` at that position instead, and leaves a site file that already has its own `/api/ask/` block unchanged. Nginx configuration and certificate renewal are server administration tasks, not part of the upload protocol.

## Trip assistant service

"Tanya AI" is an optional, password-protected Node service behind the same origin. Static deploys do not touch it: it reads the HTML of the live release from `current/public` (every page except `places/ask/`) and rebuilds that text when the `current` symlink changes, so new content reaches the assistant without a restart. `places/ask/index.html` is a normal `places/<slug>/index.html` path for `deploy.py`.

- `china-itinerary-ask.service`: systemd unit (`DynamicUser`, read-only filesystem) running `/usr/bin/node /opt/china-itinerary-ask/ask-server.mjs` on `127.0.0.1:8790`.
- `nginx-ask.conf`: installed as `/etc/nginx/snippets/china-itinerary-ask.conf`; proxies `/api/ask/` without buffering.
- `install.sh`: installs or updates the bundle, unit, env file and snippet; rolls nginx back if `nginx -t` fails.
- Source, bundled by `npm run build:ask` into `ops/ask/dist/ask-server.mjs` (Node built-ins only) and typechecked by `npm run check:ask`: `server.ts` (routes, Origin and JSON checks, streaming), `auth.ts` (scrypt password, signed session cookie), `chat.ts` (request limits, Anthropic call, web search, client tool loop), `tools.ts` (tool definitions and runner), `trains.ts`, `web-page.ts`, `geo.ts`, `safe-fetch.ts`, `prompt.ts` (instructions, China date and current page), `corpus.ts` (HTML to text), `limits.ts`, `config.ts`.

Live tools, run by the service itself between model turns (`tool_use` → `tool_result`), next to Anthropic's server-side web search:

- `check_trains`: one day's direct trains between two stations or cities (Chinese names) from `trains.ctrip.com/webapp/train/list`, parsed from the page's `__NEXT_DATA__` JSON: train, times, duration, seat classes with price and seats left (Ctrip shows 99 for plenty). Ctrip sends TLS clients without ALPN to a captcha page, so `safe-fetch.ts` offers `http/1.1`. If Ctrip changes the page or blocks the server, the tool says so and the model must not guess.
- `fetch_page`: one public page as plain text (about 16,000 characters), text content types only.
- `get_weather`: Open-Meteo forecast (1–7 days, Asia/Shanghai, weather codes in Indonesian, sunrise and sunset); places via Open-Meteo geocoding, then Nominatim.
- `get_route`: car (`router.project-osrm.org`) or walking (`routing.openstreetmap.de`) distance and time between `lat,lng` points or Nominatim place names; no traffic and no public transport, so the answers stay estimates and transit still goes to Amap links.

All outbound requests go through `safe-fetch.ts`: http(s) on ports 80 and 443 only, every resolved address checked against private, loopback, link-local and reserved ranges at connect time, redirects re-checked per hop (at most 4), 12–15 s timeouts and capped bodies. At most 4 tool calls run per model turn and `ASK_TOOL_MAX_ROUNDS` turns per question; after the last round the model must answer without tools.

Endpoints: `GET /api/ask/health`, `GET /api/ask/session`, `POST /api/ask/login`, `POST /api/ask/logout` and `POST /api/ask/chat` (server-sent events). Error bodies are `{"error": "<Indonesian message>"}`.

`/etc/china-itinerary-ask.env` (root:root `0600`, written by `install.sh`) holds `ANTHROPIC_API_KEY`, `ASK_PASSWORD_HASH` (scrypt) and `ASK_SESSION_SECRET` (generated). Optional keys keep their defaults when absent: `ASK_SITE_ROOT`, `ASK_ORIGIN` (`https://china.muhammadyana.me`), `ASK_HOST`, `ASK_PORT` (`8790`), `ASK_WEB_SEARCH_MAX_USES` (`3`), `ASK_TOOL_MAX_ROUNDS` (`4`, `0` turns the live tools off). `ASK_DEV=1` also accepts `http://localhost` origins and is for local runs only.

Install or update from a Mac:

```sh
npm run build:ask
ssh deploy@119.28.110.221 'install -d -m 0700 ~/china-itinerary-ask'
scp ops/ask/dist/ask-server.mjs ops/ask/china-itinerary-ask.service ops/ask/nginx-ask.conf ops/ask/install.sh deploy@119.28.110.221:china-itinerary-ask/
ssh -t deploy@119.28.110.221 'sudo bash ~/china-itinerary-ask/install.sh'
```

The files stay in `deploy`'s home, not in `/tmp`: root runs them, so no other account may be able to write there, and they survive a reboot for later reruns. `install.sh` refuses a staging directory or file that is not owned by root or the sudo user, or that group or others can write. The script asks for the Anthropic API key and the assistant password; both are required on the first install, and an empty answer keeps the current value. It restarts the service, waits for `/api/ask/health`, reloads nginx and prints the public `/api/ask/session` check.

- Rotate the key or password: rerun the commands above and type only the new value. A new password signs out every device.
- Sign out every device without changing the password: delete the `ASK_SESSION_SECRET` line from the env file, then rerun `install.sh`; it generates a new secret.
- Logs: `journalctl -u china-itinerary-ask -f`. Each chat logs one line with duration, stop reason, token counts (input, cache read and write, output, searches) and the number of tool calls; a failed tool logs its error; questions and answers are never logged.

Cost: the model is `claude-haiku-5-5`. The site text is about 505,000 characters, roughly 170,000–200,000 tokens (Anthropic's rule of thumb is about 2.5 characters per token; not yet counted with the API), so requests fall in Haiku 5.5's higher price tier for prompts over 100,000 tokens. That text is cached for one hour: a question after an idle hour writes the cache at twice the input rate, questions within the hour read it at a tenth and keep it alive. Web search runs at most 3 times per question and is billed per search. In-process limits apply to everyone together and reset on restart: 30 chats per 10 minutes, 300 per 24 hours, and 10 failed logins per 15 minutes (which also locks out the owner for that time). Set a monthly spend limit for the key's workspace in the Anthropic Console as the hard cap.

## Activation and recovery

The handler serializes deployments with a file lock, writes a fresh release, retains previous hashed CSS/JS/font assets for in-flight pages, and atomically switches `current`. A direct-origin HTTPS check verifies both `release.json` and the index hash. Failure restores the previous symlink; successful deployment prints a JSON receipt and saves it outside the public directory as `deployment.json`.

Rerunning a commit creates a distinct release. Old releases are never automatically deleted. A trusted administrator can roll back by atomically repointing `current` to a retained release; the restricted Actions key cannot execute an arbitrary rollback shell command. Do not modify the handler through the release payload: update the root-owned installed copy separately after reviewing changes to `ops/deploy.py`.

Run protocol tests locally with:

```sh
python3 -m unittest discover -s ops -p 'test_*.py' -v
```
