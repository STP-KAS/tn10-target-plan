# Core targets 1-8

Seeded in [plan/PLAN.md](../plan/PLAN.md) section M. Not executed.

1. Mempool rotation, rusty-kaspa issue #1146 (open).
2. `GetUtxosByCovenantIds`, PR #1152, merged 3 Nov 2026, not in v2.1.0.
3. Script units / compute budget, issue #1073 (open). PR #1074 merged 14 Oct 2026, not in v2.1.0.
4. Mempool spent-outpoint remove, PR #1160, merged 12 Nov 2026. Author says the map is not read.
5. `GetTransactionsByAcceptingBlock`, PR #1164, merged 4 Nov 2026, not in v2.1.0.
6. Post-partition observation in the direction of open PR #1147. The patch is not merged and a short peer cut is not an IBD.
7. Desk v2.1.0 (`01b532e8`, 22 Sep 2026) against one verified independent public node.
8. IBD v11 (#1136), covenant script limits, coinbase rejection (#1137), ZK SDK (#953), and the new RPC cursors. IBD only on a disposable node after a disk check.

Pass and fail lines, and the safety limits, are in section M of the plan. A run tags the numbers it actually covers.
