#!/usr/bin/env bash
# bin-check.sh — what is already built on the box, and does it start. No compile, no network:
# each binary is pointed at a closed loopback port, so it can reach no node. TESTNET-10 config only.
set -u
BIN=${TTT_BIN:-/workspace/tmp/bin-pr165}
VPROGS_SRC=${VPROGS_SRC:-/workspace/ttt-runner/src-ref/vprogs}
VPROGS_REV=${VPROGS_REV:-bcebf59}
ELF=${TTT_ELF_DIR:-/workspace/ttt-runner/private/elf}
mkdir -p "$ELF"
echo "== sha256"
for f in ttd ttflow ttloop ttt-guest-program.elf; do sha256sum "$BIN/$f" | awk -v n="$f" '{print n, $1}'; done
echo "== pins embedded in the binaries"
for f in ttd ttflow; do echo "$f vprogs $(strings "$BIN/$f" | grep -o 'checkouts/vprogs-[0-9a-f]*/[0-9a-f]*' | sort -u | sed 's|.*/||' | tr '\n' ' ')  rusty-kaspa $(strings "$BIN/$f" | grep -o 'checkouts/rusty-kaspa-[0-9a-f]*/[0-9a-f]*' | sort -u | sed 's|.*/||' | tr '\n' ' ')"; done
echo "== backend ELFs from vprogs $VPROGS_REV (committed in that tree; extracted, not built)"
for p in batch-processor batch-aggregator; do git -C "$VPROGS_SRC" show "$VPROGS_REV:zk/backend/risc0/$p/compiled/program.elf" > "$ELF/$p.elf" && sha256sum "$ELF/$p.elf" | awk -v n="$p" '{print n, $1}'; done
echo "== start test against a closed loopback port (no node reachable)"
TMPK=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')   # throwaway key, never funded
D=$(mktemp -d)
( cd "$D" && TT_WRPC_URL=ws://127.0.0.1:9 TT_NETWORK=tn10 TT_PRIVATE_KEY=$TMPK TT_PROGRAM_ELF="$BIN/ttt-guest-program.elf" \
  TT_BATCH_ELF="$ELF/batch-processor.elf" TT_AGGREGATOR_ELF="$ELF/batch-aggregator.elf" TT_DATA_DIR="$D/ttd-data" TT_PROVE=0 RISC0_DEV_MODE=1 \
  TT_DA_BIND=127.0.0.1:0 timeout 20 "$BIN/ttd" 2>&1 | tail -n 4 | sed -E 's/kaspatest:[a-z0-9]+/kaspatest:<addr>/g'; echo "ttd exit ${PIPESTATUS[0]}" )
( cd "$D" && TT_WRPC_URL=ws://127.0.0.1:9 TT_NETWORK=tn10 TT_LANE_ID=1 TT_COVENANT_ID=$(printf '00%.0s' {1..32}) TTFLOW_PRIVATE_KEY=$TMPK \
  timeout 20 "$BIN/ttflow" 2>&1 | tail -n 4 | sed -E 's/kaspatest:[a-z0-9]+/kaspatest:<addr>/g'; echo "ttflow exit ${PIPESTATUS[0]}" )
rm -rf "$D"
