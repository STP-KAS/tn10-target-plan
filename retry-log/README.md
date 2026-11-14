# Retry log

Target-oriented. A missed target is not dropped. The next attempt is a new pre-run repo, numbered by TN10 ops from pre-run 24 upward, and a new row here. No time lock after 23:30 Europe/Brussels. Limits never relax: Testnet-10 only, no mainnet, disk first, modest mining, no fabrication, never wipe the Mini node, never stop or restart desk kaspad, serve, or keeper.

Columns for each row, once a run exists:

| When (Brussels) | Pre-run | Target | Met or not met | What failed | What changed for the next attempt | Next pre-run | Core tags |
|---|---|---|---|---|---|---|---|
| 13 Nov 22:55–23:27 | [24](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-24) | covenant hop + KCC-20 mint + tic-tac-toe guest carrier, accepted on the desk node in one window | not met (hop met 6,678; mint met 30 of 30; guest not met) | guest line: no built tic-tac-toe runner on the desk, the Mini or the box, and no compile allowed tonight. Bot: NO SEND suspend (box-side fetch stall, HOLD-3 read 245 s late) | nothing can change tonight for the guest line; the runner must be built and reviewed on another day. Bot waiter: second HOLD-3 path and a heartbeat | not tonight: a retry of the same target needs the guest runner; pre-run 25 (speed) waits for 24's combined target per section B | 1 |
| 14 Nov 00:46–01:17 | [24 retry 1](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-24-retry-1) | the same as 24 | met (hop 7,139; mint 30 of 30; guest 8 of 8) | one fix during the run: the guest kit read the lane id from a DA-state field that does not exist, so the first ttflow stopped on its config before sending; rerun in the same container with the lane id ttd logged | one change from 24: the guest line ran (kit tools/ttt-guest-runner 04db647, existing binaries, no compile) in a desk-local Linux container sent to the desk's own node; the bot moved to the desk (operator's 00:30 rule). For the next guest run: fix the kit's lane-id read | pre-run 25 may follow (24's combined target now met) | 1 |

No row is invented ahead of a real attempt. The table starts empty.

## Rows

One row so far (pre-run 24). Retry count for pre-run 24: 0.
