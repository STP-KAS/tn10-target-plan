#!/usr/bin/env bash
# stop-guest.sh <run-dir> — reads the DA once (games by status), then stops this run's ttd. Touches nothing else.
set -u; RUN=$1; P=$RUN/private/guest; PORT=${TTT_DA_PORT:-9880}
for s in open playing finished; do echo "$s $(curl -s --max-time 5 "http://127.0.0.1:$PORT/api/games?status=$s&limit=100" | grep -o '"state_name"' | wc -l)"; done | tee "$P/da-games.txt"
[ -f "$P/ttd.pid" ] && kill "$(cat "$P/ttd.pid")" 2>/dev/null; echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) GUEST ttd stopped" >> "$RUN/logs/guest-phase.log"
