#!/usr/bin/env bash
# Turns on email delivery of website enquiries on Vercel, for both projects that
# deploy this repo, then redeploys them so the live site picks it up.
#
#   bash scripts/setup-lead-email.sh
#
# The mailbox password is typed with hidden input, checked against GoDaddy's mail
# server first, then piped straight to Vercel, where it is stored as a sensitive
# variable. It is never printed, written to disk or passed on a command line.
set -euo pipefail
cd "$(dirname "$0")/.."

SCOPE="hmunna36-2008s-projects"
PROJECTS=("aapkaloan" "aapkaloan-dfjj")
PROD_URLS=("aapkaloan.vercel.app" "aapkaloan-dfjj.vercel.app")
SMTP_PORT=465

command -v vercel >/dev/null || { echo "The Vercel CLI isn't installed (npm i -g vercel)."; exit 1; }
vercel whoami >/dev/null 2>&1 || { echo "Log in to Vercel first: vercel login"; exit 1; }
[ -d node_modules/nodemailer ] || { echo "Run npm install first."; exit 1; }

is_email() { [[ $1 =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]]; }

# Only the password is secret — this first question shows what you type.
while :; do
  read -r -p "Mailbox that sends the enquiries — press Enter for info@aapkaloan.com: " SMTP_USER
  SMTP_USER=$(printf '%s' "${SMTP_USER:-info@aapkaloan.com}" | tr -d '[:space:]')
  is_email "$SMTP_USER" && break
  echo "  That isn't an email address. (Don't type the password here — it's the next question.)"
done
read -r -s -p "Password for $SMTP_USER (typing is hidden): " SMTP_PASS; echo
[ -n "$SMTP_PASS" ] || { echo "No password entered — nothing changed."; exit 1; }
while :; do
  read -r -p "Email address(es) that receive enquiries, comma-separated — press Enter for $SMTP_USER: " LEAD_EMAIL_TO
  LEAD_EMAIL_TO=$(printf '%s' "${LEAD_EMAIL_TO:-$SMTP_USER}" | tr -d '[:space:]')
  ok=1; IFS=',' read -r -a addrs <<< "$LEAD_EMAIL_TO"
  for a in "${addrs[@]}"; do is_email "$a" || ok=0; done
  [ $ok -eq 1 ] && [ ${#addrs[@]} -gt 0 ] && break
  echo "  Please enter email address(es), e.g. info@aapkaloan.com"
done
export SMTP_USER SMTP_PASS SMTP_PORT

# Check the login before changing anything. GoDaddy has regional outgoing servers,
# so try each; stop at a wrong password rather than retrying it elsewhere.
SMTP_HOST=""
for host in smtpout.secureserver.net smtpout.asia.secureserver.net smtpout.europe.secureserver.net; do
  printf "Checking %s ... " "$host"
  set +e
  result=$(SMTP_HOST="$host" node -e '
    require("nodemailer").createTransport({
      host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT, secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000, greetingTimeout: 10000,
    }).verify().then(() => console.log("OK"), (e) => { console.log(`${e.code || "ERROR"}: ${e.message}`); process.exit(1); });' 2>&1)
  status=$?
  set -e
  if [ $status -eq 0 ]; then echo "login OK"; SMTP_HOST=$host; break; fi
  echo "$result"
  if [[ $result == EAUTH* ]]; then
    echo; echo "GoDaddy rejected the password for $SMTP_USER. Nothing was changed on Vercel."
    echo "Check it by logging in at https://email.secureserver.net (GoDaddy webmail), then run this again."
    exit 1
  fi
done
[ -n "$SMTP_HOST" ] || { echo; echo "Couldn't reach a GoDaddy mail server. Nothing was changed on Vercel."; exit 1; }

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
set_var() { # name value [--no-sensitive]; production only
  printf '%s' "$2" | vercel env add "$1" production --force --yes ${3:-} --scope "$SCOPE" --cwd "$TMP" >/dev/null
}
for i in "${!PROJECTS[@]}"; do
  echo "Saving settings on Vercel project ${PROJECTS[$i]} ..."
  rm -rf "$TMP/.vercel"
  vercel link --yes --project "${PROJECTS[$i]}" --scope "$SCOPE" --cwd "$TMP" >/dev/null
  set_var SMTP_HOST "$SMTP_HOST" --no-sensitive
  set_var SMTP_PORT "$SMTP_PORT" --no-sensitive
  set_var SMTP_USER "$SMTP_USER" --no-sensitive
  set_var LEAD_EMAIL_TO "$LEAD_EMAIL_TO" --no-sensitive
  set_var SMTP_PASS "$SMTP_PASS" # sensitive by default on production
  echo "Redeploying ${PROD_URLS[$i]} so the live site picks them up ..."
  vercel redeploy "${PROD_URLS[$i]}" --target production --scope "$SCOPE" --cwd "$TMP" >/dev/null
done
unset SMTP_PASS

echo
echo "Done. Send a test enquiry at https://aapkaloan.vercel.app/contact —"
echo "it should reach $LEAD_EMAIL_TO within a minute."
