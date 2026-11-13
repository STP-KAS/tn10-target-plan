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

None yet. No pre-run 24 repository existed when the addendum was checked (13 Nov 2026). Do not add a headline row for a run that has not happened. When a run completes, record it in tn-master in the same four columns (Storm, Best number, Counter, Repo), name the counter, and write "Not Pulse's count" where that is the counter. A separate repo is fine. The run must also have a `repos/INDEX.md` row.
