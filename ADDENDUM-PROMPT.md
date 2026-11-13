# ADDENDUM PROMPT for Grok Build (13 Nov 2026)

Posted by TN10 ops at stp's request. Testnet-10 only. Never mainnet. Do not fabricate.

## Status

1. **The main prompt work is done.** TN10 ops has checked [READY.md](READY.md) (commit `b424002`, "READY. Plan handoff only. Addendum not started."). TN10 ops reviews `plan/PLAN.md` separately in `reviews/REVIEW-01.md`. That review does not block the addendum below.
2. **This is your confirmation.** Run the addendum now, as one job and in one pass.

## Handoff

When you finish the addendum, post a second clear READY signal: a file `READY-ADDENDUM.md` plus a commit titled "READY-ADDENDUM", stating exactly what was done and where. TN10 ops confirms before anything further starts, so that work does not overlap.

## The addendum (one block)

1. **Headline table.** The headline-per-storm table on the tn-master landing page used to end at pre-runs 1 to 9; pre-runs 10 to 23 were missing.
   - TN10 ops already added one row each for pre-runs 10–23 in tn-master commit `04d18be`, with 17 marked failed and 21 void.
   - **Verify those rows against each run's own files** (LESSONS, ANALYSIS, FAILED, status) and FINDINGS. Do not re-add or rewrite them. Report any row that doesn't match its source, quoting the source line.
   - Extend the table with tonight's runs in the same format (Storm | Best number (reported) | Counter | Repo). Name the counter, and note "Not Pulse's count" where it applies.
2. **Every run since September.** Check that every real test or run since September is recorded in tn-master the same way as the others, cross-checked against `repos/INDEX.md`.
   - Four missing runs (25 Sep Build wallet load, 26 Sep round 8, 27 Sep desk CPU miners, 10 Oct public-node test) were added in `04d18be`. Verify them.
   - Report anything still missing. Do not invent a row for a run that didn't happen.
3. **Going forward.** Record every new TN10 run in tn-master in this same standardized format as soon as it completes, starting with pre-run 24.
4. **Separate repos are fine** per pre-run where needed, but every run must also be recorded in tn-master.

Note: this repo's `history/snapshot/` is from tn-master `26323f6`. It predates `04d18be` (headline rows) and `4465ac9` (FINDINGS 80, public node count). Verify against live tn-master, not the snapshot.

## Limits

- Testnet-10 only. Never mainnet. Real run data only.
- No hosts, IPs, ports, keys, addresses, covenant ids or txids in anything public.
- Humble tone ("we observed", corrections welcome).
- Don't touch tn-master's ADVICE-TO-DEVELOPERS, DISCLAIMER or credits.
- Normal pushes only, no force-push.
