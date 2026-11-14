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

Armed on the operator's word at 21:45 Brussels ("Yes just arm for the sake of good"), which overrode the 23:30 line above for pre-run 24. The repository name follows the earlier pre-runs (`tn10-storm-2026-11-11-prerun-24`) rather than the suggested `2026-11-13` form. When a run completes, record it in tn-master in the same four columns (Storm, Best number, Counter, Repo), name the counter, and write "Not Pulse's count" where that is the counter. A separate repo is fine. The run must also have a `repos/INDEX.md` row.
