# Runs from pre-run 24

TN10 ops names each run and continues the number from pre-run 24. Pre-runs 1 through 23 are in [tn-master](https://github.com/STP-KAS/tn-master). The headline rows added in `04d18be` were checked against live tn-master `4465ac9` and against each run's own files. The check is [findings/HEADLINE-CHECK.md](../findings/HEADLINE-CHECK.md). Matching rows were not rewritten. Pre-run 21 is void.

Each armed run keeps the same public shape as those pre-runs, in its own repository, and a row in this file:

- hashes first, then an offline rehearsal, then `logs/PRE-RUN-OPEN.md`
- armed, HOLD, and RETURN markers
- `logs/METHOD.md`, a timeline, `logs/ANALYSIS.md`, `logs/LESSONS.md`
- status, lock, and README
- a row in tn-master `repos/INDEX.md` when TN10 ops updates that map
- a numbered FINDINGS entry, and an `OBSERVED-FOR-DEVELOPERS.md` note, only when the run actually warrants one
- status is one of: done, failed, void, in-progress

Every run README, status file, and index row adds three fields:

- Target: what this run must show
- Met or not met
- Retry count, and which earlier run it retries

Also tag any core-sourced target from plan section M (1 through 8) that the run covers.

Suggested repository names, which ops may replace: `tn10-storm-2026-11-13-prerun-24` and upward. Do not reuse a name. Do not write `REVIEW_CLOSED` on the Wednesday 11 Nov neuron.

No run directory is created here until a run has been armed by TN10 ops, and not before 23:30 Europe/Brussels on 13 Nov 2026.

## Index rows for tonight

| Pre-run | Repo | Window (Brussels) | Target | Met or not met | Retry count | Core tags | Status |
|---|---|---|---|---|---|---|---|
| 24 | [tn10-storm-2026-11-11-prerun-24](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-24) | 13 Nov 22:55–23:27 (21:55:45Z–22:27:14Z) | one covenant hop, one KCC-20 mint and one tic-tac-toe guest carrier accepted on the desk node in one window | **not met** (combined): hop met (6,678), mint met (30 of 30), guest not met (no runner on disk, no compile) | 0 | 1 (0 of 910 accepted ids still listed, light load) | done |
| 24 retry 1 | [tn10-storm-2026-11-11-prerun-24-retry-1](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-24-retry-1) | 14 Nov 00:46–01:17 (13 Nov 23:46:07Z–14 Nov 00:17:04Z) | the same as 24 | **met** (combined): hop met (7,139), mint met (30 of 30), guest met (8 of 8 carriers of one tic-tac-toe match on the desk node's accepted ids) | 1 (retries 24) | 1 (0 of 869 accepted ids still listed, light load) | done |
| 25 | [tn10-storm-2026-11-11-prerun-25](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-25) | 14 Nov 02:02–02:34 (01:02:39Z–01:34:13Z) | the same three components still land in one window with one knob raised (family count 4 → 8), and the first component to fall behind is named | **met** (combined): hop met (14,339), mint met (30 of 30), guest met (8 of 8); no component fell behind | 0 | 1 (0 of 920 accepted ids still listed) | done |
| 26 | [tn10-storm-2026-11-11-prerun-26](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-26) | 14 Nov 03:25–03:56 (02:25:46Z–02:56:14Z) | a table of landings (hop, mint, guest), template mass and fee estimate at baseline / lane 1× / mix at 2× / lane zero, and our heavy lane back to zero | **met**: table in counts/chain/FEE-STEP.md, lane stopped at its zero; hop 14,264, mint 60 of 60, guest 16 of 16; no component fell behind | 0 | 1 (0 of 880 accepted ids still listed) | done |
| 27 | — | not opened | merged covenant / accepting-block RPCs | not opened: no binary with the November merges exists without compiling (release v2.1.0 is the latest; CI artifacts are the wasm32 SDK only) | — | — | waiting for a binary |
| 28 | [tn10-storm-2026-11-11-prerun-28](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-28) | 14 Nov 08:47–08:50 (07:47Z–07:50:26Z) | soft partition, desk–Mini peer cut by a local filter | **not run, blocked before the link**: admin sessions after the bot app was restarted as admin; temporary forward and allow rule made on Mini; desk `addPeer` refused (`Method unavailable in safe mode. Run the node with --unsaferpc argument.`); a restart is forbidden. Forward and rule removed and checked. Baseline: Mini pool 2,705, at least 10 already accepted | 0 | 5 | stopped; needs an operator-planned restart with `--unsaferpc` (or a start flag that peers the two) |
| 28 retry 1 | [tn10-storm-2026-11-11-prerun-28](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-28/blob/main/counts/RETRY-1.md) | 14 Nov 08:55–09:12 (07:55Z–08:12:53Z) | the same; one change: Mini kaspad restarted once (same data, plus `--unsaferpc`), link from the Mini side | **met**: both pools empty at the end of the 5-minute window after a 3-minute cut; our three transactions landed. Mini's restart cleared its 2,705-entry pool (at least 10 accepted). All TN10-prerun28 rules and forwards removed and checked | 1 | 5 | done |
| 29 | [tn10-storm-2026-11-11-prerun-29](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-29) | 14 Nov 04:48–05:01 (03:48Z–04:01Z) | paired table: desk v2.1.0 vs one verified public node (fee estimate, mempool, tip block), one normal submit each way | **met**: table filled; fee estimates equal (100) on both in all samples; 3 distinct public ids | 1 | 7 | done |
| 30 (no-disk part) | [tn10-storm-2026-11-11-prerun-30](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-30) | 14 Nov 04:11–04:15 (03:11:56Z–03:15Z) | coinbase rejection, script-mass pair, ZK verify; IBD not run | coinbase **met**; script-mass pair **met** (crossing rejected at transient mass 1,000,000); ZK **not met** (no artifact); IBD not run | 1 | 8 | done |
| 30, IBD part | [tn10-storm-2026-11-11-prerun-30](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-30/blob/main/counts/IBD.md) | 14 Nov 05:03–07:05 (04:03:29Z–06:05:20Z) | a disposable fresh v2.1.0 node on the desk (own data dir, loopback ports, disk guard 150 GB) syncs TN10 from nothing, or records how far it got | **met**: synced in 1 h 59 min 44 s (headers 12 min, UTXO set 49 + 25 min for 337.8 million entries, blocks 27 min); same DAA and pruning point as the main node; 46 GB directory deleted | 1 | 8 | done |
| 31 | [tn10-storm-2026-11-11-prerun-31](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-31) | 14 Nov 11:59–12:06 (10:59:28Z–11:06:36Z) | the input count where pre-run 30's script crosses transient mass 1,000,000 on the desk node | **met**: 463 inputs rejected at the node's 1000664; 462 inputs accepted and landed (SDK mass 280,478). All script coins returned | 0 | 8 | done |
| 32 | [tn10-storm-2026-11-11-prerun-32](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-32) | 14 Nov 12:30–13:01 (11:30:34Z–12:01:03Z) | the pre-run 25 mix still lands with the family count 8 → 12, and the first component behind is named | **met**: hop 20,377, mint 30 of 30, guest 8 of 8; no component fell behind. Ready mass about one block in the published HOLD-2 minutes. Not the 3,040 tx/s step | 0 | 1 (0 of 880 accepted ids still listed) | done |
| 33 | [tn10-storm-2026-11-11-prerun-33](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-33) | 14 Nov 13:30–14:13 (12:30:15Z–13:13:03Z) | the three lines stay up under a payment ladder at 1,013 / 2,027 / 3,040 / one minute at 4,053 / 1,013 again, and the first line behind is named | **met** on the three-part target: hop 13,620, mint 30 of 30, guest 8 of 8. Floor hops left their quiet pace at 1,013. Payment submit-OK stayed near the offer through 3,040; same-minute inclusion of our payments plateaued near 123,000–133,000 a minute at 3,040 and at the 4,053 minute. Tail: 3,272,071 of 3,272,071 payment submits included | 0 | 1 (0 of 1,440 accepted ids still listed) | done |
| 34 | [tn10-storm-2026-11-11-prerun-34](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-34) | 14 Nov 14:44–15:19 (13:44:03Z–14:19:36Z) | the same ladder with one knob: floor families 100 → 200 sompi/gram, payments stay at 150; name the first behind | **not met**. HOLD-1 and HOLD-2 met on payment submit-OK. At 1,013, floor hops 709–778 (quiet 796 and 833). At 2,027, floor hops 315–381 while payments stayed near the offer. HOLD-3 not met (submit-OK about 7,000 a minute after the pool fell). RETURN not scored. Guest 8 of 8. Mint 90 accepts, 0 rejects, stopped on the try cap. Counter snapshot at the stop: 26,726 floor hops, 90 kcc hops | 0 | 1 (36 samples, 0 still listed, 40 ids in the later samples) | failed |

Armed on the operator's word at 21:45 Brussels ("Yes just arm for the sake of good"), which overrode the 23:30 line above for pre-run 24. The repository name follows the earlier pre-runs (`tn10-storm-2026-11-11-prerun-24`) rather than the suggested `2026-11-13` form. When a run completes, record it in tn-master in the same four columns (Storm, Best number, Counter, Repo), name the counter, and write "Not Pulse's count" where that is the counter. A separate repo is fine. The run must also have a `repos/INDEX.md` row.
