# TN10 test plan, night of 13 Nov 2026

Status: draft for TN10 ops review. Not armed. Not run.
Network: Kaspa Testnet-10 only. Never mainnet.
Earliest arm: 23:30 Europe/Brussels, 13 Nov 2026. Not earlier.
Numbering: TN10 ops names the runs. The suggestion below starts at pre-run 24. Pre-runs 1-23 are already in tn-master. Pre-run 21 is void.
Plan text: this file. The same text is in `plan/tn10-test-plan-tonight.pdf`.

This planner researched and wrote the plan. It did not start, arm, or run a test. It did not restart a node, wipe data, or mine.

## A. Oversight summary

What was checked, on 13 Nov 2026, before this plan was written.

tn-master commit `26323f66` (2026-11-13T17:56:34Z) contains pre-runs 1 through 23 as index rows 48 through 70. Pre-run 21 is void (network outage about 10:25Z-10:33Z, robot vacuum, no findings). No pre-run in 1-23 is missing from that index. Older storms, from the 18 Sep 2026 mining journal through the 11 Nov Wednesday plan, are rows 1-47, with row 31 unused. The copy is in `history/snapshot/`.

Several questions from those pre-runs are settled enough to reuse as levers and not to re-ask tonight. A rule that can step down settled. A never-down rule climbed, including alone, and the 2,000 cap path with `FROZEN` ran live in pre-run 22. Paying 2,000 sompi/gram did not land more than 460 when the lane had 8 chains. The desk template tracked how many of our transactions were ready (likely, not proven) in pre-runs 20, 22, and 23. The connectivity guard was added after pre-run 21. From pre-run 5 on, the bot's public check found only two distinct public kaspads and wrote a legal `NO SEND` (`no-free-node`). Price hops on the node's own mass. `getMempoolEntries` failed around 13,000 entries in pre-run 16 (128 MiB wRPC reply cap). Key 0 fragmentation aborted pre-runs 13 and 17.

rusty-kaspa v2.1.0 is tag `01b532e8`, published 2026-09-22T13:55:36Z. Master on this read was `5417ed03`, 2026-11-12T22:57:55Z. The desk node is stated as v2.1.0 and must not be stopped or restarted, so merges after 22 Sep are not assumed to be on the desk. Those later merges include #991 (15 Oct, `GetUtxosByAddressesV2`), #1074 (14 Oct, compute commit), #1152 (3 Nov, `GetUtxosByCovenantIds`), #1164 (4 Nov, `GetTransactionsByAcceptingBlock`), and #1160 (12 Nov, mempool outpoint remove). Issues #1073, #1146, and #1147 were still open. #1147 is not merged.

The string `vprox` was not found as a Kaspa repository, issue, or code hit. Searches: GitHub code and issues under kaspanet and STP-KAS, and the public repository list of biryukovmaxim. Unrelated proxy projects turned up under that string and are out of scope. The TN10 tic-tac-toe a core contributor built is [biryukovmaxim/vprog-tictactoe](https://github.com/biryukovmaxim/vprog-tictactoe). Tip `d97ee421` (2026-11-06) pins vprogs `release-candidate` at `6d068974`. kaspanet/vprogs master is still `f9b84a8` (28 Jul 2026). Maxim had 34 open pull requests on that repo at this read. The recent ones describe TN10 settler and prover failures (mass-capped settlement funding on 1-2 Oct, a reorg duplicate on 23 Sep, a hot-zone rollback on 13 Nov). Those commits are not in the tic-tac-toe lock. A HEAD request to the hosted game returned HTTP 200 during planning. That is not a gameplay check.

KCC-20 on kaspanet/kccs `kcc-0020.md` at main `1ed87aef` (2026-10-21) says `Status: Final`.

The operator's mining-wallet balance, as given for this plan, is 6,214,316 tKAS, confirmed 13 Nov about 18:35 Brussels from two public nodes that agreed. This planner did not re-read the desk wallet. Spend is not the limit. Each probe still has an estimate and a logged cap. Five million tKAS is the operator's ceiling statement. The planned caps below are far under that.

What is proposed. One combined load first (covenants, one fresh KCC-20 family, and the existing tic-tac-toe carrier if it is already on disk), at a modest rate, from 23:30 Brussels, only after TN10 ops reviews. Then raise speed only if that target is met. Then one bounded fee step, using the 2x observation from pre-runs 14-16, not a new greedy climb. Then the post-v2.1.0 RPC probes, only on a node whose version contains them. Then a short desk-to-Mini soft partition that does not restart the desk. Then public-node observation on the list TN10 ops verifies. A disposable IBD only if a disk check says there is room for another Testnet-10 dataset. Details are sections B through O.

Risks. Our heavy transactions have slowed other Testnet-10 users on our own node (FINDINGS 39, 44, 46, 53, 58, 62, 66, 70, 74, 77-78). Tonight stays bounded, says so in the run repo, and steps the extra load back to zero. The box filled on 26 Sep under pruning pressure (tn-master index row 11). Node data is about 90 GB. No second copy of the chain on the desk or the Mini. Do not restart desk kaspad, serve, or keeper. Do not wipe the Mini. Do not rebuild the RISC Zero guest or the settler tonight. A full mempool dump can fail the wRPC socket. Public nodes get observation and normal-rate submits only.

Open questions for TN10 ops, before the arm.

1. The re-verified public-node list was not handed to this planner. Until it is, the public half of targets 1 and 7 is not armed, and the bot plans for `NO SEND`.
2. Mini's binary version was not read. If it is v2.1.0, targets 2, 4, and 5 cannot pass on Mini or the desk. That result is `not met`, reason `binary predates the merge`. It is not a reason to restart the desk.
3. Whether a tic-tac-toe runner is already built on disk was not checked, because checking by launching it would start a test. If the runner or the ELF is absent, the guest part of pre-run 24 is `not met` with that reason. Do not compile it tonight.
4. Desk wallet balance was not re-read. Use the stated mining-wallet pool, and log spend.

## B. Executive plan

Clock. Review can happen before 23:30. No runner starts before 23:30 Europe/Brussels. After that there is no time lock. A missed target is retried in the next numbered repo. TN10 ops may stop the night. The caller can be asleep. The hand-off is this repo.

Order. The combined setup has to work before a specialized probe. Do not open pre-run 27 until pre-run 24's combined target is met, or until ops records why that target cannot be met tonight (missing guest binary, disk, or a dead node). Raising speed is pre-run 25 only after 24 is met. Fee pressure is pre-run 26 only after the faster mix has a reading.

| Pre-run | What | Target in one line | Core tags | Do not start until |
|---|---|---|---|---|
| 24 | Combined whole, modest | One covenant hop, one KCC-20 mint, and one guest carrier land in the same window on the desk node, or an honest reason the guest or the mint cannot | 1 light sample | Review done, 23:30, nodes verified |
| 25 | Same whole, faster | The mix from 24, raised one step, still lands all three, and the first component to fall behind is named | 1 | 24 met |
| 26 | Fee step on that mix | A bounded 2x fee step changes landings in a way the run can point at, then the extra load returns to zero | 1, 7 if a public node is verified | 25 met, or 25's only miss is fee-unrelated and ops records that |
| 27 | Post-release RPCs | Each RPC that the binary actually has is called within its own pass/fail line | 2, 3, 4, 5 | 24 met or blocked with a written reason |
| 28 | Soft partition | After a short desk-Mini peer cut, accepted transactions do not sit forever in the other mempool, and the desk process never restarted | 1, 6 | 24 met or blocked with a written reason |
| 29 | Public compare | Template shape and fee estimate, desk against one verified independent public node, at a normal rate, or a legal NO SEND | 7 | Ops has published the verified count of distinct nodes |
| 30 | Disk-gated edges | Coinbase rejection on our node; IBD only on a disposable node if disk allows; one ZK verify only if a receipt already exists | 8 | Disk check written down |

Every one of these is a separate public run repo plus a row in `runs/README.md` and `retry-log/README.md`. Status is done, failed, void, or in-progress. A void (no usable data, as in pre-run 21) does not count as a met target and does not count as a scientific miss. The next number retries it.

Controls reused, not re-asked: node-mass pricing, three clean minutes as the scoring shape for a submit-OK gate, inclusion reported beside it, connectivity guard, family end time taken from the run start (pre-run 22's fault), usable-tKAS projection before genesis, bot free-check once before arming, legal `NO SEND` when no free distinct public kaspad exists. HOLD-4 on the bot only after the desk's HOLD-3, or that legal `NO SEND`. Plan for no-send.

Modest mining. Do not start extra miners. Do not change the desk node's mining setup. If the Mini node is down, start it from its existing data. Never wipe it.

## C. Probe cards

Shared setup for every card.

TN10 ops verifies the nodes it chooses: synced, peers present, DAA moving, disk free space written down. Desk kaspad stays up. Loopback only on the desk, as in the playbook. No Windows PowerShell 5.1. No `KaspaPublicNode` on the desk. No devnet. No second runner. Hashes and an offline rehearsal before `PRE-RUN-OPEN`. Mini counts and does not send. Bot sends only in a HOLD-4 minute on a free public kaspad, or writes `NO SEND`.

Abort, all cards. Desk process gone or restarted. Mini data wiped or its disk filling. Free space on either box approaching the 26 Sep failure (ops picks the numeric floor at the pre-flight and writes it; this plan does not invent a byte count). DAA stalled. Connectivity guard trips. Usable coins on the family key projected under the playbook abort line (2,500 coins and 18,000 usable tKAS, from the current playbook). A public node receives anything other than a normal-rate, well-formed submit or a read. Any mainnet endpoint. Any secret about to be committed.

Spend is an estimate from earlier logged runs, not a quote. Pre-run 23 logged about 16,884 tKAS of fees for a heavy lane plus four covenant tiers. Pre-run 22 logged about 10,290. A KCC-20 mint on a quiet network on 11 Oct was about 0.13 to 0.16 tKAS at 204 sompi/gram (tn-master FINDINGS 16). Tonight's caps are planning caps. The run log replaces them with the measured spend.

### Pre-run 24. Combined whole, modest

Question. Can a covenant hop, a KCC-20 mint, and one tic-tac-toe carrier be in flight together, at a rate the last two days already sustained for covenants alone, and each land at least once on the desk node?

Why it matters. Builders stack these on one mempool. The last two days tested covenants. 11 Oct measured mint mass. 25-26 Sep ran the guest under a storm and found fee starvation and UTXO reuse, not illegal moves. Nobody in this map has published the three together on today's binaries.

Setup. Four covenant families, not sixteen. Fee tier priced on the node's mass at the ordinary floor used in pre-runs 14-16 (the 100 sompi/gram label after node-mass calibration, not the under-priced label from pre-run 13). One new KCC-20 launch name that does not reuse a family already launched in earlier desk notes. Mint rate: one mint at a time, waiting for accept, cap 30 mints. Guest: one deposit or one turn through the runner that is already on disk, against the pinned `6d068974` stack, or against the hosted game only as a manual observation if ops chooses. No new ELF. No heavy lane. No greedy rule. No payment flood. Mempool sample is a small id sample 60 seconds apart, the method in issue #1146, not a full dump.

Success. At least one accepted covenant hop, one accepted mint, and one accepted guest carrier in the same open window, desk process still the one that was verified, disk line held, bot either silent until HOLD-3 and then a legal `NO SEND` or a HOLD-4 on a free node. Target field: met. Retry count: 0.

If the guest binary is absent, success for the other two still stands, the guest line is not met, and the reason is written. That is not a pass of the combined target. Pre-run 25 does not raise speed. A later retry keeps the same three-part target.

Abort. Any shared abort. Also: a second runner, a rebuild starting, or the mint path relaunching a known family.

Spend estimate. Covenant side well under the pre-run 23 family spend if the window stays short: cap 5,000 tKAS. Mint side cap 200 tKAS. Guest side cap 100 tKAS. Planning cap 5,300 tKAS.

Disk and mining. Reads and a few transactions. No IBD. No extra miner. The 26 Sep disk emergency is the reason the family count starts at four.

### Pre-run 25. Same whole, faster

Question. When the pre-run 24 mix is still intact, which component falls behind first as the offer rises one step?

Why it matters. Core and wallet authors need the first failure mode, not a blended TPS number. Submit-OK was not inclusion under heavy payment load (OBSERVED, items 23-24).

Setup. Keep the three components. Raise only one knob from the 24 lock: family count from 4 toward 16, or mint spacing, or the payment offer, and write which one. Do not turn two knobs. Stay under the over-capacity band that built a backlog in pre-run 8 (about 110,000-132,000 accepted tx/min on that desk node when the offer was over the band). The first faster step is the pre-run 10 shape that still included as sent: 1,013 then 1,500 tx/s of ordinary payments beside the families, only if 24's modest mix was met with room. If 24 was already near a stall, the step is smaller and is written down before the arm. Guest stays one carrier at a time, not a farm. Scoring shape stays three clean minutes of submit-OK, inclusion beside it.

Success. All three components still land. The timeline names the first component whose landings fall off, and the load at that minute (offer, mempool size, ready count, fee estimate). If nothing falls off, that is met too: "no component fell behind at this step."

Abort. Shared abort. Also a second knob turned mid-run. A runner is never restarted mid-run to apply a fix (pre-run 2).

Spend estimate. Cap 20,000 tKAS, from the pre-run 22-23 range. Log the actual.

Disk and mining. Same as 24. Stop if the mempool probe would need a full dump above 10,000 entries. Use the light fee estimate above that line, as pre-run 17 did.

### Pre-run 26. Fee step on the mix

Question. On the mix that 25 held, what does one bounded fee increase change for landings, stalls, the desk template, and the fee estimate?

Why it matters. Pre-runs 14-16 observed that about twice a heavy competitor's rate held a hop's pace, and that the fee estimate rose even when low-fee traffic was only partly hurt. That was covenants against our own lane. It was not measured with a mint and a guest carrier in the same window.

Setup. Keep the 25 mix. Add one heavy lane of ours, ready cap 8, the region where pre-run 23's template stayed mostly full (about 7 percent of samples under 400,000 mass at 8 ready, versus 30 and 88 percent at 15 and 30). Fee on the covenant and mint side at about twice that lane's node rate, held, not a never-down rule. No climb toward 1,405 or 2,000. Those climbs are already logged. Step the lane to zero before RETURN. State in the run repo, in public, that the lane slows other users' low-fee transactions while it runs. Compare desk fee estimate and template mass to a no-lane baseline minute in the same run. If ops has verified one independent public node, read its fee estimate at the same time. Do not send the heavy lane to a public node.

Success. The lane runs, returns to zero, and the log shows landings for covenant, mint, and guest at the 2x step versus the baseline minute. Template mass and fee estimate are in the same table. Other users' traffic on our node is counted the way pre-run 23 counted it. Target met means the table exists and the lane stopped, not that a particular theory won.

Abort. Shared abort. Ready count drifting above the cap. Lane still on at the scheduled zero. Any submit of the heavy shape to a public node.

Spend estimate. Pre-run 23's lane was about 12,136 tKAS at higher rates and a longer window. This lane is shorter and at a lower rate. Cap 15,000 tKAS including the families. Log it.

Disk and mining. Unchanged. Modest. The lane is transactions, not hash rate.

### Pre-run 27. RPCs the binary may not have

Question. On a node that actually contains the November merges, do the new covenant and accepting-block RPCs answer, paginate, and match a smaller known set?

Why it matters. #1152 and #1164 are the integrator surface for covenant apps and for "what did this block accept." #991 is the cursor API they were modeled on. v2.1.0 does not contain them.

Setup. Read the node version or the commit it prints. Proceed only if that build is master at or after `5417ed03`, or ops records the merge commits present (`af6ff23` for #1152, `4863866` for #1164, `bb738ee` for #1160, `01b532e8` is not enough). Desk v2.1.0 is the negative control: one call that is expected to be missing, recorded, and not repeated in a loop. The positive calls go to Mini or a disposable node. Page sizes stay inside the #1152 text: default 1,000, max 5,000 ids, larger only if that node was started with the unsafe RPC flag. Do not turn that flag on for the desk. Compare a covenant-id page to an address-index page for the same outputs our own families just created. Labels in the repo, not ids. `GetTransactionsByAcceptingBlock`: one id we just saw accepted, then a deliberate duplicate id in one request. The duplicate must error, on our node only. #1160: do not claim the internal map was read. The author of #1160 says `pool_unspent_outputs` is write-only and the one-line fix has no observable runtime effect. The observable check is the one that already existed: a second spend of a mempool outpoint is rejected, under a light submit and under a short multi-input submit, on our node. Record the version beside that result.

Success. For each RPC the binary has: a page or a transaction comes back, the duplicate-id call errors, and the covenant-id count matches the address-index count on our own small set. For each RPC the binary lacks: `not met`, reason recorded, no retry against the desk by restarting it. #1160 is met when the double-spend reject is logged with the version. It is not met by a story about the map.

Abort. Shared abort. Any malformed or duplicate-id call aimed at a public node. Any attempt to restart the desk to upgrade it.

Spend estimate. Cap 1,000 tKAS. These are reads plus a handful of our own transactions.

Disk and mining. None beyond the existing nodes, unless the only binary with the merges is a disposable node. That disposable node is pre-run 30's disk rule, and 27 waits for it.

### Pre-run 28. Soft partition

Question. After a brief loss of the desk-Mini peer link, with both processes left running, do transactions the other side has already accepted leave the mempool once the peer returns?

Why it matters. Issue #1146 reports a synced TN10 node keeping already-accepted transactions, zero rotation, after IBD. PR #1147, still open as of 2026-10-15, adds a full mempool revalidation when IBD completes. A short peer cut is not that IBD path. It is the angle the operator asked for. The result is an observation next to those tickets, not a test of an unmerged patch, and not a test of v2.1.0 unless the version line says v2.1.0.

Setup. Our two nodes only. Confirm both synced and DAA moving. Take a 60-second mempool id sample on each (small sample, not a full dump). Cut the peer path between them by a local filter on the Mini or the desk host. Do not stop either kaspad. Keep the cut short, a few minutes, and restore it. Connectivity guard stays armed. If DAA stops on the desk, abort and restore. After peers return, sample again. Do not restart the desk to "clear" the pool.

Success. Met if the post-restore sample on each node no longer lists ids that the same node, or the peer, shows as accepted, inside the observation window the run declares before the cut (suggest 5 minutes after restore, written in the lock file). Not met if those ids remain, which is logged as the same shape as #1146 and pointed at open #1147. Either result is a finished target. A retry changes the cut length or the sample, and says so. Void if the network itself drops, as in pre-run 21, and the cut is not the thing we did.

Abort. Desk process exit. Cut longer than the lock file allows. Filter left in place at the end. Any restart.

Spend estimate. Cap 2,000 tKAS if a small submit is needed so each side has fresh ids. Prefer ids already in flight from pre-run 24-26 if those runs are still the same night and the pool is quiet enough to name.

Disk and mining. No IBD. No miner change.

### Pre-run 29. Public comparison

Question. Under one normal-rate submit that both can see, does the desk v2.1.0 fee estimate and template shape match a verified independent public TN10 node?

Why it matters. Pre-run 9 observed the public path landing hops faster than the desk path at the same fee. Public fee quotes during storms were hypothesized, and not shown, to be stale mempools (FINDINGS 11). Target 7 asks for a paired reading.

Setup. Use only the list TN10 ops verifies. Count aliases once (same p2p id is one node). The earlier "two backends" result is lifted only for ids ops marks independent. Submit at the modest pre-run 24 rate, to the desk and, if a free public node exists, one normal-rate submit to that public node. No heavy lane. No malformed input. No flood. Read fee estimate on both. Read template or recent block fullness only through the RPC that node already exposes. Bot HOLD-4 only after desk HOLD-3, else `NO SEND`.

Success. A table: time, distinct public node count, fee estimate desk, fee estimate public, template or block tx count if both exposed it. Met if the table is filled. If no free distinct node, met as `NO SEND` for the bot and `not met` for the public half of target 7, with the verified count written down. Do not invent a third node.

Abort. Shared abort. Any non-normal submit to a public node. Using an unverified list.

Spend estimate. Cap 3,000 tKAS.

Disk and mining. Reads plus the modest submit. No IBD.

### Pre-run 30. Edges that need a disk decision

Question. Which of the v2.1.0 edge checks can be done tonight without a second 90 GB chain and without a prover build?

Why it matters. They are in the release the desk already runs: chunked IBD (#1136, merged 2026-09-20, in the v2.1.0 notes), coinbase mempool rejection (#1137, same day), ZK SDK crate (#953, merged 2026-06-23, called out in the v2.1.0 notes), script-unit accounting after the Toccata cleanup. The operator asked for stress around them. Disk safety outranks a full IBD.

Setup. Three independent checks, each skipped with a written reason if its precondition fails.

Coinbase. On the desk node only, submit one transaction the node classifies as coinbase. Pass: rejection, and the error names `RejectCoinbase` or the rule text the node actually returns. Fail: the node accepts it. One shot, not a loop. Not to Mini if Mini is only a counter. Not to any public node.

Script mass. On our node, a small covenant with several inputs, still far inside the published limits, so we learn the error string at the edge without sitting on it. Limits read from rusty-kaspa master `5417ed03`, file `consensus/core/src/config/params.rs`: `max_script_public_key_len` 10,000; `MAX_SIGNATURE_SCRIPT_LEN` 250,000; block mass compute 500,000, storage 500,000, transient 1,000,000. `TRANSIENT_BYTE_TO_MASS_FACTOR` is 4 in `consensus/core/src/constants.rs` on that tree. The release notes describe script units as unconditional after the Toccata cleanup. This plan does not use a 25 KB figure. That number was not in these files. Pass: the node accepts a covenant inside the limits and rejects one that crosses a limit, with the error string kept. Our node only.

ZK. If a receipt file is already on disk from the tic-tac-toe checkout, verify one under the combined load's tail. Pass: verify returns and the node stays up. If no receipt exists, `not met`, reason `no artifact, build declined`. Do not start a CUDA build. PR #172 says a generated proof can come out invalid (it cites risc0 issue 3760) and retries inside the unmerged prover. That retry is not armed tonight.

IBD. Only a fresh disposable Testnet-10 process, its own data directory, after the disk check shows room for on the order of another 90 GB plus a margin ops writes down. Not the Mini data directory. Not the desk data directory. Pass: the new node negotiates protocol 11 with a v2.1.0 peer, logs chunked sync, and either reaches sync or fails in a way the log names (timeout, disk, peer). A mixed protocol-10 peer is recorded if one is actually seen. It is not manufactured. If the disk check fails, IBD is `not met` for disk, and that is the correct result.

Spend estimate. Cap 1,000 tKAS for the script-mass pair. Coinbase and ZK verify should spend nothing if the rejection and the receipt behave. IBD spends disk, not tKAS.

Disk and mining. This is the only card allowed to create node data, and only the disposable directory, and only after the check. Mining stays as it is. The disposable node does not need to mine.

## D. Combined-load matrix

The main event is the three-way mix. Separate baselines are the no-load minutes inside the same run, not a different project. "Fails first" means the first component whose accepts in a minute fall below half of its own baseline minute, while the desk node is still synced. If the node itself stops accepting, the node fails first and the component table is secondary.

| Mix | Duration shape | Fee | What we watch for "fails first" |
|---|---|---|---|
| 4 families + 1 mint at a time + 1 guest carrier | Until three clean minutes, then one rotation sample | Node-mass floor (about 100) | Any of the three absent. That is pre-run 24, not a speed failure |
| Same, one knob up | Three clean minutes at the new offer | Same floor | Covenant hop rate, mint reject, or guest carrier reject. Name which minute |
| That mix + ready-cap-8 heavy lane | Baseline minute, 2x minute, zero minute | Lane at its calibrated rate; defenders at about 2x that rate, held | Low-fee covenant tier, mint, guest, or other users' traffic on our node |
| Same mix, public read | One paired minute | Floor only. No heavy lane on the public node | Fee estimate or template disagreement. Not a flood |
| After peer restore | 5 minutes, declared in the lock | Whatever is already in the pool | Stale accepted ids. Not a new load |

Durations are targets, not a clock that ends the night. A miss becomes the next pre-run with one change, logged in `retry-log/README.md`.

Full failure audit. Every condition that was armed gets a row: mix, fee, duration, first component, error string, mempool size, ready count, fee estimate, template mass, whether other users on our node slowed, spend, disk free at start and end. A condition that was not armed is absent, not scored.

## E. Maxim push-issue brief

"vprox" is not a name these repositories use. This brief is the verifiable-program work Maxim pushed in the last weeks, which is what a search for his recent TN10 push actually returns. No other proxy name is in this plan.

kaspanet/vprogs master is `f9b84a863a7c7c20586a9cf947550475e894f72e`, 28 Jul 2026. It is not the tree the open pull requests sit on as merged code. At this read Maxim had 34 open pull requests on kaspanet/vprogs. The ones updated 12-13 Nov 2026, quoted from their own bodies:

- #169, open, updated 2026-11-12, mergeable state dirty. Incident on TN10 2026-10-01/02: a settlement built from 37 small UTXOs exceeded the per-transaction mass cap (516,168 against 500,000). The node rejected it. The settler's stop took the daemon down, unflushed receipts were lost, and on restart the committed-gap pass froze the covenant because later bundles proved from a base the covenant never took. The branch bounds the funding walk and maps mass overflow onto a fee-exhausted retry. Not merged.
- #164, open, updated 2026-11-12. Incident 2026-09-23 20:31 UTC on a CUDA prover at `ea7b823e`: an L1 reorg left the settled boundary unresolvable, duplicate bundles were proved, a state-neutral duplicate passed the settler's state-only guard, and the settler task panicked. Not merged.
- #172, open, updated 2026-11-13. A generated proof can come out invalid (the body cites risc0/risc0#3760). The branch retries until a receipt verifies, and re-forms a failed bundle. Not merged.
- #173, open, updated 2026-11-13. The worker kept folding a window from a base the covenant never took, so no settlement advanced. The branch holds that fold and re-roots at the boundary. Not merged.
- #176, open, updated 2026-11-13. `CanonicalChain::rollback` left the hot zone's tail above the tip. A release build then dropped canonical bits and the prover read stale versions. The body says this was observed while investigating #175. Not merged.

These are the concrete push problems. They are unmerged. The tic-tac-toe lock of 6 Nov does not contain them. Tonight does not build this stack. A guest failure on the pinned `6d068974` tree is evidence about that tree, not about #169, #172, #173, or #176.

What is worth doing with them tonight, without a build. If the existing runner is up, record whether a single carrier still lands while pre-run 24's modest load is on. If a settlement funding error appears, copy the error string into the run repo and stop. Do not "fix" the settler in-place. The mass-cap incident is the one that touches tonight's fee and UTXO fragmentation lessons: pre-runs 13 and 17 already showed a fragmented key aborting a lane. A settler funded from many small coins is the same shape. Keeping the guest funder on a few large coins is the operational lesson from #169's body, not a new code change.

## F. Tic-tac-toe location and relevance

Found. [biryukovmaxim/vprog-tictactoe](https://github.com/biryukovmaxim/vprog-tictactoe). Description in the repo list: tic-tac-toe with stakes as a vprogs guest program on Kaspa. Created 29 Aug 2026. The README's Testnet-10 section says the same stack runs against a testnet-10 wRPC node, with real proofs, and points at `docs/demo/tn10-multi-server-setup.md`. Tip on this read: `d97ee421f78ba6f9bc8bb8b6b8300878a9dcc59a`, 2026-11-06T14:20:55Z, message "pin vprogs release-candidate 6d068974". The guest ELF is a per-deploy build artifact. The hosted demo named in the 25 Sep master-file note returned HTTP 200 to a HEAD request during this planning session. The body was not fetched and no move was sent. The hostname is left out of this repo.

Also found, and not the match. michaelsutton/kdapp, tip recorded in the Kaspa master file as `eade853` (2 Jul 2025), includes a tic-tac-toe example that defaults to testnet-10 and pins rusty-kaspa v1.0.0. The master file's "do not weld" line says kdapp tic-tac-toe is not the vprogs guest. It is not the game this plan uses.

Not found. Any repo, doc path, or issue titled or worded `vprox` in kaspanet, STP-KAS, or biryukovmaxim. The master file's tic-tac-toe notes (`VPROG-TICTACTOE.md`, README Now) use vprog-tictactoe. tn-master's September rounds use the same name (index rows 10 and 12: rounds 3 and 5).

Relevance. The game is still the right TN10 carrier for "does a published guest survive our load." Round 3 (26 Sep) recorded about 130-138 of their own vprog moves per second at a 1k background and 5 tic-tac-toe games under the full 10x storm, no illegal move executed, and named the client's fee and UTXO layer as the weak point. Round 5 recorded 63,614 tic-tac-toe games and 39,703 vprog programs finished, 0 illegal moves, and a 150x fee that was counterproductive. Those are reasons to keep one carrier inside the combined load.

The game is not a test of this week's unmerged settler and prover work. The 6 Nov lock is older than #169's latest update and does not include #172, #173, or #176. Rebuilding the ELF or the CUDA settler to chase those pull requests would spend disk and time the 26 Sep incident says we do not have, and it would test a tree TN10 ops has not reviewed as a binary. Verdict: use the existing runner if it is already built; do not change the testing approach into a prover rebuild; do not treat a landing on `6d068974` as a pass of the November pull requests. If the runner is absent, say so and leave the guest target not met.

## G. KCC-20

It fits tonight as one component of the combined load, not as a mint rush.

Source. kaspanet/kccs main `1ed87aef59faff8354061aee30f734a3b8b2c3d2`, 2026-10-21, file `kcc-0020.md`, header `Status: Final`, title Fungible Token Covenant Specification. The tip commit message on that same SHA is "KCC-1: advance to Final (#39)". The KCC-20 status line was read from the file body, not inferred from the commit title.

What earlier runs already measured. FINDINGS 16: one KCC-20 public mint is one transaction. On 11 Oct, 2,488 mints on a quiet network, 0 rejects, compute 9,117, transient 26,068, storage 61,710-76,586 grams, 204 sompi/gram, about 0.13-0.16 tKAS each. Storage binds first. The arithmetic in that finding, not a new measurement, is about 6-8 mints per block if a block held only mints. A mint of an already-spent minter is rejected before it pays. The mint-rush plan repo `tn10-storm-plan-mint-rush` is a plan, not a run, and this night does not arm it. Its own rate and fee notes conflict with the 11 Oct logs (see that repo). Tonight does not inherit those rates.

Tonight. One fresh launch name. No relaunch of a family this desk has already published. Cap 30 accepts in pre-run 24, then only the single knob pre-run 25 turns. Fee on the node's mass, ordinary bucket first, 2x only inside pre-run 26. Success: the mint accepts, or it rejects with the node's script-verification text, and the text is kept. A reject is a result, not an automatic retry, if the text is the cap or the already-spent minter. A reject of "script units exceeded" is handed to the #1073 card in section M, not papered over by raising the fee. Estimated spend is inside pre-run 24's 200 tKAS mint cap until the log replaces it.

## H. Gaps this window cannot answer

- Whether #1147's post-IBD revalidation works. The pull request is open and unmerged. A soft partition does not walk the IBD path. A real IBD of a second full node is unlikely to fit the disk rule.
- Whether #1160 changed runtime behavior. Its author says the map is unread. We can only re-check double-spend rejection.
- Whether the November vprogs pull requests fix the incidents they describe. They are unmerged and will not be built tonight.
- Whether the hosted tic-tac-toe still settles a match. HEAD 200 is not a match. A full match needs proofs and is out of scope without an existing runner.
- A census of public TN10 nodes. This plan uses only the list ops verifies. The old two-kaspad result stays the bot's default until that list arrives.
- Mainnet behavior. Out of scope on purpose.
- A max-TPS flood, a governance sender, and a KCC-20 mint rush at the 11 Oct storm's payment rates. Separate work. Not tonight.
- The desk wallet's current balance. Not re-read.
- kaspa.org's homepage, fetched during planning, does not document these RPCs. The RPC claims rest on the GitHub release, issues, and pull requests, not on that homepage.

## I. Sources

- STP-KAS/tn-master commit `26323f66aa1550982daf04f61c770c20f64b2801` (2026-11-13T17:56:34Z): `README.md`, `repos/INDEX.md`, `FINDINGS.md`, `OBSERVED-FOR-DEVELOPERS.md`, `PLAYBOOK.md`, `history/TIMELINE.md`, `history/storms/2026-11-11-prerun.md`. Snapshot in this repo under `history/snapshot/`.
- STP-KAS/kaspa-master-file local board, used as a map of older pins, not as a substitute for the GitHub reads above. Tic-tac-toe notes in `VPROG-TICTACTOE.md` and the README Now table. The live tip was re-read on GitHub and is `d97ee421`, which is newer than that board's September pins.
- kaspa.org homepage, fetched 13 Nov 2026. It does not contain the RPC or mempool notes used here.
- rusty-kaspa release v2.1.0, tag `01b532e8b553523216471682649693af92f0fd16`, published 2026-09-22T13:55:36Z. Release notes name #1136, #1137, #1138, #953, the Toccata cleanup pulls, and script units.
- rusty-kaspa master `5417ed03f4732459cdd594ee0d1bb868c3838bde`, 2026-11-12T22:57:55Z.
- Issues, still open at this read: #1073 (updated 2026-10-13), #1146 (updated 2026-10-13), #1147 (updated 2026-10-15, "Fixes #1146", not merged).
- Pull requests merged after the v2.1.0 tag: #991 merged 2026-10-15 (`GetUtxosByAddressesV2`), #1074 merged 2026-10-14 (compute commit), #1152 merged 2026-11-03 commit `af6ff23a0b3e8271407da3203ce4017dd188d7ec`, #1164 merged 2026-11-04 commit `4863866fce8439d0305b410fc4d802e7261d54d0`, #1160 merged 2026-11-12 commit `bb738ee0d789344234666e4497864a2086f0f4a2`.
- Pull requests in the v2.1.0 notes: #1136 merged 2026-09-20, #1137 merged 2026-09-20, #953 merged 2026-06-23.
- kaspa-python-sdk #78 merged 2026-09-10. Comments on #1073 from Knitser, IzioDev, jeffsiegel1965, and explife365, including IzioDev on 2026-10-13 that #1074 was still being finished with Maxim. #1074 then merged the next day. #1073 was still open.
- kaspanet/kccs `kcc-0020.md` at `1ed87aef59faff8354061aee30f734a3b8b2c3d2`, status Final, 2026-10-21.
- kaspanet/vprogs master `f9b84a8`, and open pulls #164, #169, #172, #173, #176, bodies read 13 Nov 2026.
- biryukovmaxim/vprog-tictactoe commit `d97ee421`, 2026-11-06. A HEAD request to the hosted demo named in the 25 Sep master-file note returned 200 during planning. The hostname is not stored here.
- params and the transient factor: `consensus/core/src/config/params.rs` and `consensus/core/src/constants.rs` on master `5417ed03`, as retrieved through GitHub code search and the raw file tree on that date. Figures used: script public key max 10,000, signature script max 250,000, block mass 500,000 / 500,000 / 1,000,000, transient byte factor 4.

## J. This repo

URL: https://github.com/STP-KAS/tn10-test-plan-2026-11-13

Layout:

- `README.md`, `DISCLAIMER.md`, `NOT-ARMED.md`
- `plan/PLAN.md`, `plan/tn10-test-plan-tonight.pdf`, `plan/REVISION.md`
- `reviews/README.md`, and later `reviews/REVIEW-NN.md`
- `history/SOURCE.md`, `history/snapshot/` (tn-master at `26323f66`, including the full index, findings, playbook, timeline, and the pre-run 1-23 history page)
- `retry-log/README.md`
- `runs/README.md` (pre-run 24 onward, empty until armed)
- `targets/` points back at section M. The targets are seeded here, not executed.

Two people edit this repo: TN10 ops and the planner. Changes after review are normal commits that name a `REVIEW-NN.md`. No force-push. No secrets, hosts, IPs, keys, addresses, covenant ids, or transaction ids.

## K. Research answer, written before the runs were ordered

Question asked of the current core tree, not of a wish list. What is worth testing on Testnet-10 for builders, core, and contributors?

Worth testing, because the change is recent and the binary on the desk may not have it yet.

1. Mempool entries that a block has already accepted. #1146 is open, with a TN10 report of zero rotation and a later comment that a non-mining node recovered only by churn, not by the IBD path. #1147 is the proposed fix and is not merged. A paired 60-second sample under a light mix and under our own mix is a direct check. This became the sample inside pre-runs 24, 26, and 28.

2. `GetUtxosByCovenantIds` (#1152, merged 3 Nov) and `GetTransactionsByAcceptingBlock` (#1164, merged 4 Nov), plus the cursor API #991 (merged 15 Oct). They are the new read path for covenant apps. They are not in tag `01b532e8`. Testing them on the desk by upgrading would mean restarting kaspad, which this window forbids. This became pre-run 27, gated on the version string.

3. "Script units exceeded" with a compute budget set (#1073, still open). The July comments attribute `used=100000, limit=9999` to the free allowance and to SDKs dropping `computeBudget` on serialize. #1074 merged 14 Oct on rusty-kaspa. Python SDK #78 merged 10 Sep. A desk on v2.1.0 can still be the pre-#1074 side. This became the script-unit line in section M, on our node only, with the SDK version written down.

4. Settlement funding and the mass cap, from vprogs #169's TN10 incident (516,168 > 500,000, daemon exit, frozen covenant). The guest in the public tic-tac-toe lock does not contain that fix. The safe test is one carrier on a few large coins, not a fragmented funder and not a rebuild. This became the guest line of pre-run 24 and the "do not rebuild" rule.

5. Fee estimate and template shape, desk v2.1.0 against one other node, under a submit both can see. Pre-run 9 already saw a public-versus-desk landing difference. Pre-runs 20-23 saw the template follow ready count. This became pre-runs 26 and 29, without repeating the greedy climb.

6. P2P protocol 11 chunked IBD is in v2.1.0 (#1136). A second full sync is a disk decision, not a curiosity. This became pre-run 30's disposable node, skippable.

7. Coinbase rejection in the mempool is in v2.1.0 (#1137). One negative submit on our node is enough. This became pre-run 30.

8. KCC-20 is Final as a document and was measured on a quiet network at mint-sized mass. It has not been in the same window as the November covenant fee work. One fresh family inside the combined load is the test. A rush is not.

Not worth re-testing as a question. Greedy versus step-down. The 2,000 cap and `FROZEN`. Chain count versus ready count as the template's main knob (already observed, still "likely"). The connectivity guard. The bot's no-free-node result, except as a fresh count once ops finishes the public-node re-check.

## L. How the plan is built

Step 1. Pre-run 24 puts covenants, KCC-20, and the tic-tac-toe carrier in one window, at a rate the covenant path has already survived. The bar is the combination, not the speed.

Step 2. Pre-run 25 raises one knob. The combination stays.

Step 3. A miss is a new pre-run. One change, written in the retry log. The target stays. There is no elapsed-time stop after 23:30.

Step 4. Fee pressure (pre-run 26) comes after the mix has a met reading, and it uses a held 2x step, not a new escalation rule.

Step 5. Specialized core probes (27-30) wait until the combined target is met or is blocked by a reason ops writes down (missing binary, missing guest build, disk). They are not an escape hatch from a failed combination.

TN10 only. No mainnet. Disk first. Modest mining. No fabrication. Observations are phrased as what our runs showed. Corrections belong in issues on this repo.

## M. Core-sourced targets 1-8

Seeded here. Not executed. Each run that covers one tags it. Pass and fail are for that run's lock file.

1. Mempool rotation, issue #1146, open. On a synced TN10 node, under the light mix (pre-run 24) and the heavier mix (pre-run 26), and again after the soft reconnect (pre-run 28): ids that the same node shows as accepted are absent from a later 60-second sample. Fail: those ids are still listed and the sample shows no rotation, the shape #1146 reported. Do not full-dump above 10,000 entries.

2. `GetUtxosByCovenantIds`, PR #1152, merged 2026-11-03, commit `af6ff23`. Only on a binary that contains it. Paginate our own fresh covenant outputs. The page count matches the address index for that same labeled set. Cursor and page-size edges stay inside the pull request's 5,000 / 5,000 / default 1,000 limits. Fail: mismatch, a stuck cursor, or a missing RPC on a binary that claims the merge. A missing RPC on v2.1.0 is `not met / binary predates the merge`, not a defect claim.

3. Script units, issue #1073, open, and PR #1074, merged 2026-10-14, which v2.1.0 does not contain. Small timelock-style covenant on our node. Record node version and SDK version. Pass: either the #1073 rejection text is reproduced (`script units exceeded`, with the used and limit numbers the node prints) or the same build accepts, and the log shows which side of #1074 the binary is on. Fee ramp is the pre-run 26 held step, not a second climb. Our node only.

4. Mempool outpoint fix, PR #1160, merged 2026-11-12, commit `bb738ee`. Author's statement: the removed key was wrong, and `pool_unspent_outputs` is write-only, so the fix has no observable runtime effect today. Double-spend detection uses `outpoint_owner_id`. Pass: under a light multi-input submit and a short heavier one, a second spend of a mempool outpoint is rejected, and the version is logged. We do not claim the map was observed. Same pass condition on v2.1.0, labeled pre-fix. A difference would be worth a careful note. No difference is the expected result and still meets the observable check.

5. `GetTransactionsByAcceptingBlock`, PR #1164, merged 2026-11-04, commit `4863866`. On a binary that contains it, during or just after the combined load: one accepted id returns the transaction; a duplicate id in one request returns an error. Our node for the error case. Fail: a wrong transaction, a success on the duplicate, or a timeout while the node is otherwise healthy. Missing RPC on v2.1.0 is the same honest `not met` as target 2.

6. Post-partition revalidation, the #1147 angle, pull request open and unmerged. This does not test the patch. After the pre-run 28 cut and restore, with the desk process never restarted: accepted ids leave the mempool within the pre-declared window, or they linger and the linger is logged against #1146 and #1147. Both outcomes finish the target. Void if the path was an outage rather than our cut.

7. Desk v2.1.0 against one verified independent public node. Same modest submit. Compare fee estimate and, if both expose it, template or recent block fullness. Pass: the paired table exists. If ops' list has no free distinct node, the public half is `not met` and the bot file is a legal `NO SEND`. Aliases count once. No heavy, malformed, or flood traffic to the public node.

8. Broader stress of changes already in, or just after, v2.1.0.

- IBD v11, #1136, in the release (20 MiB chunks, 1 GiB limit, transfer timeouts, protocol 10 still negotiated). Disposable node only, disk check first. Never the Mini directory. Never a desk restart. Pass: chunked sync starts and the log names progress or the failure. Skip is `not met` for disk.
- Covenant verification and script units, post-Toccata streamlining in the v2.1.0 notes (pulls #1082 through #1089 and #1101). Covered with target 3 and the script-mass pair in pre-run 30, inside the 10,000 / 250,000 / block-mass figures from `params.rs`. Not a 25 KB test. That figure was not sourced.
- Coinbase rejection, #1137, in the release. One negative RPC submit to our node. Pass: `RejectCoinbase` or the node's own rule error. Not sent to a public node.
- ZK SDK, #953, in the release notes as `kaspa-txscript-zk-sdk`, Groth16 and Poseidon2 bounds. One verify of an existing receipt, or `not met` because no artifact and no build. The unmerged prover retry (#172) is not this target.
- New RPCs and cursors. Targets 2 and 5, plus a single `GetUtxosByAddressesV2` cursor edge on a binary that has #991: a page, a resume cursor, and a cursor that is past the end. Concurrent clients: two, not a herd. Reorg-ish chain change: only the natural one if pre-run 28's partition produces it. Do not force a reorg.

Safety for this whole section. IBD only on a fresh disposable Testnet-10 directory after a disk check. Never wipe the Mini. Never stop or restart desk kaspad, serve, or keeper. Boundary and malformed calls only to our nodes. Public nodes are observation and normal-rate submits.

## N. Authority and environment

The following four statements are the operator's orders for this window. They are copied here so the PDF carries them. This planner did not inspect the Mini session or the desk session.

1. TN10 ops has full authority and oversight of the entire testing situation.
2. TN10 ops has full authority on both the Mini and the desk.
3. TN10 ops decides which nodes are used for testing and must verify them (synced, peers, DAA moving, disk) before any run.
4. Environment facts: a PowerShell session with full admin rights is open on the Mini, and a PowerShell session with full admin rights is open on the desk (Build).

The existing safety limits still apply under this authority. Testnet-10 only, no mainnet. Never stop or restart desk kaspad, serve, or keeper. Never wipe the Mini node. Disk first. Modest mining. No fabrication.

Overnight. The caller may be asleep from the start of the window through midnight Brussels and after. TN10 ops keeps going, explores a miss, and retries inside the limits above. A fix is a new commit and a retry-log row, not a silent change of the target. Ops may stop the night. Nothing arms before the review and nothing arms before 23:30 Europe/Brussels.

## O. Public node targets

TN10 ops is re-verifying the public Testnet-10 list. This planner does not have that list. The previous rehearsal's own check, FINDINGS 29 and the playbook, found two distinct public kaspads, so HOLD-4 was `NO SEND` from pre-run 5 onward. The operator's prompt for tonight says a stream shows 43 public nodes while an earlier probe found on the order of 127 addresses through about two nodes. Those two pictures are why the list is being re-checked. This plan does not pick between them.

When ops hands over the verified set, use every independent node (distinct p2p id, counted once) for three jobs only:

- Load observation: mempool size if the call is safe, template, fee estimate. No full dump if the pool is large.
- Propagation: when our own normal-rate transaction or a block we already see shows up on each independent node.
- The target 7 comparison: desk v2.1.0 against one of those nodes, same modest submit.

An alias of a node we already count is not a second target. A node ops has not verified is not a target. Public nodes do not receive malformed input, boundary probes, coinbase rejects, partition filters, or floods. The heavy lane stays on our nodes. The bot still sends only after desk HOLD-3, on a free distinct kaspad, or it writes `NO SEND`.

Until that list is in the review notes as a count of distinct ids, pre-run 29's public half stays unarmed and the bot's plan is no-send.
