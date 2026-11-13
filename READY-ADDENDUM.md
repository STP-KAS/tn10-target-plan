# READY-ADDENDUM

13 Nov 2026. Testnet-10 only. Never mainnet. This is the addendum handoff. It is not an arm, and it is not a review.

TN10 ops confirms before anything further starts.

## What was done

1. Headline rows already in tn-master commit `04d18be` were checked against each run's own files and against live tn-master `4465ac9cb7db0879a059f83cfc5ac7c1aaf673ff`, not against `history/snapshot/` (that snapshot is `26323f66`). Matching rows were not rewritten. The report, with quoted source lines, is [findings/HEADLINE-CHECK.md](findings/HEADLINE-CHECK.md).
2. Mismatches left in place for ops: the UTC windows on pre-runs 14–20, 22 and 23 are earlier than each repo's `logs/PRE-RUN-OPEN.md`; pre-run 14's "96–104" and pre-run 15's "95–99" are wider than the exact "about twice" table row in that run's LESSONS; pre-run 21's headline says "No data" while that run's LESSONS records about 540 tKAS spent and 207 lane transactions accepted, and also says there are no findings. Details and quotes are in the check file.
3. Every INDEX run since September was compared with the headline table. The one recording gap is the 7 Oct mass-ceiling link: the headline points at `what-limits-tx-rate` (INDEX: a note, not a run) while the run repo is `tn10-storm-2026-10-07`. No row was invented. The a4–a26 loop stays uncatalogued, as FINDINGS already says.
4. No pre-run 24 repository exists (search total 0). No tonight row was added to tn-master. When a run completes, it gets the same four-column headline row and an INDEX row. That has not been written, because the run has not happened.
5. Issue #1: [findings/PUBLIC-ENDPOINTS.md](findings/PUBLIC-ENDPOINTS.md). The hardcoded-alias hypothesis fits the run files and FINDINGS 80. The resolver, on that pass, still collapsed to the same two nodes. `tn10-node.kaspa.com` is recorded as a third named node and is not treated here as a verified free node. The proposal for ops is [reviews/FREE-CHECK-ENDPOINT-RULE.md](reviews/FREE-CHECK-ENDPOINT-RULE.md). It is not an approval.

tn-master was not edited. ADVICE-TO-DEVELOPERS, DISCLAIMER and credits were not touched. Nothing was armed.

## Not started

`NODE-DEEP-DIVE.md` is a separate prompt (the wide topology question). It was not started, so this handoff does not overlap it.
