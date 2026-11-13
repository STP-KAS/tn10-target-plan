#!/usr/bin/env bash
# arm-guest.sh — the guest line of a pre-run: one tic-tac-toe match on a fresh lane, one carrier at a time.
# KASPA TESTNET-10 ONLY. Uses the binaries already on disk (no compile). Refuses to send unless every gate holds.
#
#   ./arm-guest.sh --run <run-dir> --dry     # gates only, nothing started (default)
#   ./arm-guest.sh --run <run-dir> --live    # gates, then ttd (exec mode) + one ttflow match
#
# Gates for --live: <run-dir>/control/ARM-GUEST exists (the run's own arm step writes it after PRE-RUN-OPEN);
# no <run-dir>/control/STOP; private/run.env sets TT_WRPC_URL (the run's send node; testnet-10 checked here);
# the guest issuer holds 2..4 coins and the guest operator 1..4 coins, each over TTT_MIN_COIN_TKAS (default 20).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
MODE=dry RUN=
while [ $# -gt 0 ]; do case "$1" in --run) RUN=$2; shift 2;; --live) MODE=live; shift;; --dry) MODE=dry; shift;; *) echo "unknown arg $1"; exit 2;; esac; done
[ -n "$RUN" ] || { echo "GUEST abort reason=no-run-dir"; exit 2; }
BIN=${TTT_BIN:-/workspace/tmp/bin-pr165}; ELF=${TTT_ELF_DIR:-$HERE/private/elf}
P=$RUN/private/guest; mkdir -p "$P" "$RUN/logs" "$RUN/control"; chmod 700 "$P"
ph() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*" | tee -a "$RUN/logs/guest-phase.log"; }   # fixed tokens only: no ids, hosts, keys
[ -f "$HERE/private/run.env" ] || { ph "GUEST abort reason=no-run-env"; exit 3; }
set -a; . "$HERE/private/run.env"; set +a
[ -f "$RUN/control/STOP" ] && { ph "GUEST abort reason=stop-file"; exit 3; }
for f in ttd ttflow ttt-guest-program.elf; do [ -x "$BIN/$f" ] || [ -f "$BIN/$f" ] || { ph "GUEST abort reason=missing-$f"; exit 3; }; done
for f in batch-processor batch-aggregator; do [ -f "$ELF/$f.elf" ] || { ph "GUEST abort reason=missing-$f-elf"; exit 3; }; done
# Read-only gate on the send node: testnet-10, synced, the two guest keys' coins.
G=$(TTT_READ_URL="$TT_WRPC_URL" node "$HERE/readonly-check.mjs") || { ph "GUEST abort reason=node-read"; exit 3; }
echo "$G" > "$P/gate.json"
node -e '
const g=JSON.parse(process.argv[1]); const min=Number(process.env.TTT_MIN_COIN_TKAS||20);
const ok=g.network==="testnet-10"&&g.synced&&g.daa_moved_10s>0&&g.guest_issuer.coins>=2&&g.guest_issuer.coins<=4&&g.guest_operator.coins>=1&&g.guest_operator.coins<=4
  &&g.guest_issuer.tkas>=2*min&&g.guest_operator.tkas>=min;
process.exit(ok?0:1);' "$G" || { ph "GUEST abort reason=gate (network/sync/funding)"; exit 4; }
ph "GUEST gate ok mode=$MODE"
[ "$MODE" = live ] || { ph "GUEST dry-run end (nothing started)"; exit 0; }
[ -f "$RUN/control/ARM-GUEST" ] || { ph "GUEST abort reason=not-armed"; exit 5; }
K=$(node -e 'const j=require(process.argv[1]); console.log(j.issuer+" "+j.operator)' "${TTT_KEYFILE:-/home/box/secure/ttt-guest-keys.json}")
ISS=${K% *}; OPK=${K#* }
# ttd: exec mode (TT_PROVE=0, no prover, no settler, no CUDA). Fresh lane, its own data dir under the run.
( cd "$P" && TT_NETWORK=tn10 TT_PRIVATE_KEY=$ISS TT_PROGRAM_ELF="$BIN/ttt-guest-program.elf" TT_BATCH_ELF="$ELF/batch-processor.elf" \
  TT_AGGREGATOR_ELF="$ELF/batch-aggregator.elf" TT_DATA_DIR="$P/ttd-data" TT_PROVE=0 RISC0_DEV_MODE=1 TT_START_MODE=fresh \
  TT_DA_BIND=127.0.0.1:${TTT_DA_PORT:-9880} RUST_LOG=info nohup "$BIN/ttd" > "$P/ttd.log" 2>&1 & echo $! > "$P/ttd.pid" )
ph "GUEST ttd started (exec mode)"
for i in $(seq 1 ${TTT_DA_WAIT_S:-600}); do
  S=$(curl -s --max-time 3 "http://127.0.0.1:${TTT_DA_PORT:-9880}/api/state" || true)
  if echo "$S" | grep -q covenant; then break; fi
  [ -f "$RUN/control/STOP" ] && { ph "GUEST stop during bootstrap"; kill "$(cat "$P/ttd.pid")"; exit 6; }
  sleep 1
done
echo "$S" > "$P/da-state.json"
LANE=$(node -e 'const s=JSON.parse(process.argv[1]); const f=(o,k)=>o&&typeof o==="object"?(k in o?o[k]:Object.values(o).map(v=>f(v,k)).find(v=>v!==undefined)):undefined; console.log(f(s,"lane_id")??f(s,"lane"))' "$S" 2>/dev/null || true)
COV=$(node -e 'const s=JSON.parse(process.argv[1]); const f=(o,k)=>o&&typeof o==="object"?(k in o?o[k]:Object.values(o).map(v=>f(v,k)).find(v=>v!==undefined)):undefined; console.log(f(s,"covenant_id"))' "$S" 2>/dev/null || true)
[ -n "$LANE" ] && [ -n "$COV" ] && [ "$COV" != undefined ] || { ph "GUEST abort reason=no-lane-from-da"; kill "$(cat "$P/ttd.pid")"; exit 6; }
ph "GUEST lane up"
# ttflow: Init, then one scripted match (deposit A, deposit B, create, join, turn A, turn B, withdraw), one carrier at a time.
( cd "$P" && TT_NETWORK=tn10 TT_LANE_ID=$LANE TT_COVENANT_ID=$COV TTFLOW_PRIVATE_KEY=$OPK TTFLOW_STEP_DELAY_MS=${TTFLOW_STEP_DELAY_MS:-2000} \
  RUST_LOG=info timeout ${TTT_FLOW_TIMEOUT_S:-900} "$BIN/ttflow" > "$P/ttflow.log" 2>&1 ) && RC=0 || RC=$?
N=$(grep -cE 'Step [0-9.]+ \(.*\) accepted' "$P/ttflow.log" || true)
FIRST=$(grep -oE 'Step [0-9.]+ \([^)]*\) accepted' "$P/ttflow.log" | head -1 | sed -E 's/ accepted//')
ERR=$(grep -iE 'rejected|not submitted|error|panic' "$P/ttflow.log" | head -1 | sed -E 's/[0-9a-f]{64}/<id>/g; s/kaspatest:[a-z0-9]+/<addr>/g; s/wss?:\/\/[^ ]+/<node>/g' | cut -c1-200 || true)
ph "GUEST ttflow exit=$RC carriers_submit_ok=$N first=\"$FIRST\""
[ -n "$ERR" ] && ph "GUEST first-error \"$ERR\""
# Leave ttd up until the run's RETURN reads the DA (games finished, no illegal move); the run stops it with stop-guest.sh.
ph "GUEST end (ttd left running for the DA read; stop with stop-guest.sh)"
