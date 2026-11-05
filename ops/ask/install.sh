#!/usr/bin/env bash
# Installs or updates the trip assistant API on the production server.
#
# Run as root from the upload directory that holds ask-server.mjs, china-itinerary-ask.service and
# nginx-ask.conf (for example ~deploy/china-itinerary-ask, writable only by deploy):
#   sudo bash install.sh                      # prompts for the API key and password (empty keeps the current one)
#   printf '%s\n%s\n' "$KEY" "$PASSWORD" | sudo bash install.sh   # line 1 key, line 2 password; empty keeps current
# Secrets are read with the read builtin and passed to node only through stdin, never argv, env or logs.
set -euo pipefail
umask 077

SOURCE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly SOURCE_DIR
readonly ENV_FILE=/etc/china-itinerary-ask.env
readonly INSTALL_DIR=/opt/china-itinerary-ask
readonly UNIT_FILE=/etc/systemd/system/china-itinerary-ask.service
readonly SNIPPET=/etc/nginx/snippets/china-itinerary-ask.conf
readonly SITE_LINK=/etc/nginx/sites-enabled/china.muhammadyana.me
readonly ROOT_LINE='    root /home/deploy/apps/china.muhammadyana.me/current/public;'
readonly INCLUDE_LINE='    include snippets/china-itinerary-ask.conf;'
readonly HEALTH_URL=http://127.0.0.1:8790/api/ask/health
readonly NODE=/usr/bin/node
readonly BACKUP_DIR=/var/backups/china-itinerary-ask

fail() { echo "install.sh: $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "run as root"
[[ -x $NODE ]] || fail "$NODE not found"
for file in ask-server.mjs china-itinerary-ask.service nginx-ask.conf; do
  [[ -f $SOURCE_DIR/$file ]] || fail "missing $SOURCE_DIR/$file"
done
# Root installs these files: refuse a staging directory another account could have written to.
staging_uid=$(id -u "${SUDO_USER:-root}")
for path in "$SOURCE_DIR" "$SOURCE_DIR"/{install.sh,ask-server.mjs,china-itinerary-ask.service,nginx-ask.conf}; do
  owner=$(stat -c %u "$path")
  [[ $owner == 0 || $owner == "$staging_uid" ]] || fail "$path belongs to uid $owner, not root or ${SUDO_USER:-root}"
  [[ -z $(find "$path" -maxdepth 0 -perm /022) ]] || fail "$path is writable by group or others (chmod go-w)"
done

# Existing values, so a rerun only changes what was supplied. Values are written single-quoted.
declare -A current=()
if [[ -f $ENV_FILE ]]; then
  while IFS= read -r line || [[ -n $line ]]; do
    [[ $line =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]] || continue
    value=${BASH_REMATCH[2]}
    if [[ $value == \'*\' ]]; then value=${value:1:-1}; fi
    current[${BASH_REMATCH[1]}]=$value
  done < "$ENV_FILE"
fi

api_key=''
password=''
if [[ -t 0 ]]; then
  read -r -s -p 'Anthropic API key (empty keeps the current key): ' api_key; echo
  IFS= read -r -s -p 'Assistant password (empty keeps the current password): ' password; echo
else
  IFS= read -r api_key || true
  IFS= read -r password || true
fi

if [[ -n $api_key ]]; then
  [[ $api_key =~ ^sk-ant-[A-Za-z0-9_-]+$ ]] || fail "the API key does not look like sk-ant-..."
  current[ANTHROPIC_API_KEY]=$api_key
fi
[[ -n ${current[ANTHROPIC_API_KEY]:-} ]] || fail "an Anthropic API key is required on first install"

if [[ -n $password ]]; then
  # scrypt N=16384 r=8 p=1, 16-byte salt, 32-byte hash; the password arrives on stdin only.
  read -r -d '' HASH_JS <<'JS' || true
const crypto = require('node:crypto');
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  const salt = crypto.randomBytes(16);
  crypto.scrypt(input, salt, 32, { N: 16384, r: 8, p: 1 }, (error, hash) => {
    if (error) { console.error(error.message); process.exit(1); }
    process.stdout.write(`scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`);
  });
});
JS
  current[ASK_PASSWORD_HASH]=$(printf '%s' "$password" | "$NODE" -e "$HASH_JS")
fi
[[ -n ${current[ASK_PASSWORD_HASH]:-} ]] || fail "a password is required on first install"
unset api_key password

if [[ -z ${current[ASK_SESSION_SECRET]:-} ]]; then
  current[ASK_SESSION_SECRET]=$("$NODE" -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))")
fi

# Write the env file atomically: a temp file in /etc, root:root 0600, then rename over the old one.
tmp_env=$(mktemp /etc/.china-itinerary-ask.env.XXXXXX)
trap 'rm -f "$tmp_env"' EXIT
for name in "${!current[@]}"; do
  value=${current[$name]}
  [[ $value != *"'"* && $value != *$'\n'* ]] || fail "$name contains a quote or newline"
  printf "%s='%s'\n" "$name" "$value"
done | sort > "$tmp_env"
chown root:root "$tmp_env"
chmod 0600 "$tmp_env"
mv -f "$tmp_env" "$ENV_FILE"
trap - EXIT
echo "Wrote $ENV_FILE"

install -d -o root -g root -m 0755 "$INSTALL_DIR"
install -o root -g root -m 0644 "$SOURCE_DIR/ask-server.mjs" "$INSTALL_DIR/ask-server.mjs"
install -o root -g root -m 0644 "$SOURCE_DIR/china-itinerary-ask.service" "$UNIT_FILE"
systemctl daemon-reload
systemctl enable china-itinerary-ask.service >/dev/null
systemctl restart china-itinerary-ask.service

healthy=0
for _ in $(seq 1 30); do
  if curl -fsS --max-time 2 "$HEALTH_URL" >/dev/null 2>&1; then healthy=1; break; fi
  sleep 0.5
done
if [[ $healthy -ne 1 ]]; then
  journalctl -u china-itinerary-ask -n 50 --no-pager >&2 || true
  fail "the service did not answer $HEALTH_URL within 15 s"
fi
echo "Service healthy at $HEALTH_URL"

# nginx: install the snippet and include it once in the 443 server, rolling back if nginx -t fails.
site=$(readlink -f "$SITE_LINK")
[[ -f $site ]] || fail "nginx site file not found: $SITE_LINK"
stamp=$(date +%Y%m%d%H%M%S)
# Backups live outside /etc/nginx so nginx never loads them.
install -d -o root -g root -m 0700 "$BACKUP_DIR"
snippet_backup=''
if [[ -f $SNIPPET ]]; then
  snippet_backup="$BACKUP_DIR/snippet-$stamp.conf"
  cp -p "$SNIPPET" "$snippet_backup"
fi
install -o root -g root -m 0644 "$SOURCE_DIR/nginx-ask.conf" "$SNIPPET"

site_backup=''
if grep -qE '^[[:space:]]*location[[:space:]]+/api/ask/' "$site"; then
  # A copy of ops/nginx.conf proxies inline; adding the include too would fail nginx -t (duplicate location).
  echo "$site already has its own location /api/ask/ block; left it unchanged ($SNIPPET is not included)"
elif ! grep -qxF "$INCLUDE_LINE" "$site"; then
  [[ $(grep -cxF "$ROOT_LINE" "$site") -eq 1 ]] || fail "expected exactly one line '$ROOT_LINE' in $site"
  site_backup="$BACKUP_DIR/$(basename "$site")-$stamp.conf"
  cp -p "$site" "$site_backup"
  # gawk (Ubuntu) reserves "include", so the awk variable is include_line.
  if ! awk -v anchor="$ROOT_LINE" -v include_line="$INCLUDE_LINE" '{ print } $0 == anchor { print include_line }' "$site_backup" > "$site"; then
    cp -p "$site_backup" "$site"
    fail "could not edit $site; restored it"
  fi
  echo "Added the include to $site (backup: $site_backup)"
fi

if ! nginx -t; then
  if [[ -n $site_backup ]]; then cp -p "$site_backup" "$site"; fi
  if [[ -n $snippet_backup ]]; then cp -p "$snippet_backup" "$SNIPPET"; else rm -f "$SNIPPET"; fi
  fail "nginx -t failed; restored the previous nginx configuration"
fi
systemctl reload nginx
echo "nginx reloaded"

echo
echo "Public check: curl -s https://china.muhammadyana.me/api/ask/session should print {\"authenticated\":false}"
echo "  got: $(curl -s --max-time 10 https://china.muhammadyana.me/api/ask/session || echo 'request failed')"
