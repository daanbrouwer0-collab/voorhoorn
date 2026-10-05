#!/usr/bin/env bash
# Dubbelklik of start dit bestand. De app opent daarna in de browser.
set -u
cd "$(dirname "$(readlink -f "$0")")"

PORT=8791
URL="http://127.0.0.1:${PORT}/"
PIDFILE="/tmp/web-agenda-${PORT}.pid"
LOGFILE="/tmp/web-agenda-${PORT}.log"

find_node() {
  if command -v node >/dev/null 2>&1; then
    command -v node
    return 0
  fi
  local candidate
  candidate="$(ls -d "$HOME/.nvm/versions/node/"v*/bin/node 2>/dev/null | sort -V | tail -1)"
  if [[ -n "$candidate" && -x "$candidate" ]]; then
    printf '%s\n' "$candidate"
    return 0
  fi
  return 1
}

NODE="$(find_node || true)"
if [[ -z "$NODE" ]]; then
  message="Node.js is nodig om Web Agenda te starten."
  if command -v zenity >/dev/null 2>&1; then
    zenity --error --text="$message" || true
  else
    echo "$message" >&2
  fi
  exit 1
fi

running=0
if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  running=1
fi

if [[ "$running" -eq 0 ]]; then
  PORT="$PORT" nohup "$NODE" server.mjs >"$LOGFILE" 2>&1 &
  echo $! >"$PIDFILE"
fi

for _ in $(seq 1 40); do
  if curl -sf -o /dev/null "$URL"; then
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "$URL" >/dev/null 2>&1 || true
    fi
    exit 0
  fi
  sleep 0.25
done

echo "Web Agenda startte niet. Zie $LOGFILE" >&2
exit 1
