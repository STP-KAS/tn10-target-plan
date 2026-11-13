# REVIEW-01

- Plan version reviewed: `plan/PLAN.md` at commit `d8356ff` (draft 1 text, renamed repo), with `reviews/FREE-CHECK-ENDPOINT-RULE.md`, `findings/PUBLIC-ENDPOINTS.md`, `findings/HEADLINE-CHECK.md`, `runs/README.md`, `targets/README.md`, `retry-log/README.md` at `f5a28e2`.
- Reviewer: TN10 ops.
- Time: 13 Nov 2026, about 20:25 Europe/Brussels.
- **Verdict: approved with changes.** The changes below are binding for every run from pre-run 24. Nothing is armed by this file.

Testnet-10 only. Never mainnet. We are just testing; corrections welcome.

## What we checked, and what we found

| Check | In the plan? | Result |
|---|---|---|
| Run format = pre-runs 1–23 shape plus Target / Met / Retry | Yes (`runs/README.md`, plan B) | OK. Made a hard rule below (change 6). |
| Funding sized on usable coins, not on fees (pre-run 17's lesson) | Partly: "usable-tKAS projection before genesis" and the abort line are listed, but no funding step and no sizing rule | **Changed** (change 1) |
| Funding moved from the mining wallet, 3–10× the need, as a logged step | No | **Added** (change 1) |
| Disk safety | Yes, but the floor is left to "ops picks at pre-flight" | Kept, made a gate (change 2) |
| Abort line (2,500 coins and 18,000 usable tKAS) | Yes (section C) | OK, plus a margin (change 1) |
| Never stop or restart desk kaspad, serve or keeper | Yes (B, C, N) | OK. The process ids are held by TN10 ops and are not published here. |
| Mini: start it from its existing data if it is down; never wipe | Yes (B, M, N) | OK |
| Free-check rule | Proposal only | **Decided** (change 3) |
| Every run gets a tn-master headline row and an INDEX row on completion | Yes, as a note (`runs/README.md`) | Made a hard rule (change 6) |
| Earliest arm 23:30 Brussels, 13 Nov 2026 | Yes | OK |
| A "Pace and depth" section | **No** (searched the plan; "pace" only appears as a hop's pace) | **Added below** as a TN10 ops rule (change 4) |

The probe order (24 combined, 25 one knob faster, 26 one held 2× fee step, 27 RPCs gated on version, 28 soft partition, 29 public compare, 30 disk-gated edges) and the gating between them are sound and match what the pre-runs taught: combination first, one change at a time, no repeat of the greedy climb. We approve that order.

## Changes (before → after, why, how)

### 1. Funding and the budget check

- **Before:** spend caps per card (24: 5,300; 25: 20,000; 26: 15,000; 27: 1,000; 28: 2,000; 29: 3,000; 30: 1,000 tKAS); "usable-tKAS projection before genesis"; no funding step.
- **After:**
  - Before each run's hashes, move **3–10× that run's planning cap** from our own mining wallet to our run keys, as a **logged housekeeping step** in the run repo (amount and number of transactions only; no addresses, no txids). Default 10×. The operator's word (13 Nov, 16:14 Brussels): test tKAS is mined and free; take far more than needed.
  - Size key 0 on **usable coins** (coins over 3 tKAS) and the families' use per minute, **not on fees**. Use rate: about 1.06–1.09 usable tKAS per OK hop (pre-runs 17–18), and about **1,200 a minute** when 16 families run at the pre-run 23 pace (pre-run 23 LESSONS, lesson 5). Scale down for four families.
  - **BUDGET_CHECK** before genesis: projected key-0 usable at the end ≥ 18,000 (abort line) + 8,000 margin, and coin count ≥ 2,500 over 3 tKAS. If not, consolidate or refill first, then re-check. Never open on a failed check.
- **Why:** pre-run 17 failed on its own abort line because key 0 was refilled on fees, not on the coins the families use (FINDINGS 55); pre-run 13 failed on fragmentation (FINDINGS 42); after pre-run 22 "the next run does not fit our funds" (pre-run 22 LESSONS).
- **How:** same projection that held in pre-runs 18 and 23, with the funding move written down first so nobody improvises a refill mid-run.

### 2. Disk gate

- **Before:** "ops picks the numeric floor at the pre-flight and writes it."
- **After:** the pre-flight file records free disk on the desk, the Mini and the box, and the floor ops chose, **before** `PRE-RUN-OPEN`. No floor written → no open. A run that would create node data (only pre-run 30's disposable IBD) also records the space it needs. Nothing else creates chain data.
- **Why:** the 26 Sep disk emergency (INDEX row 11) and the 3 Oct disk-full crash. We do not invent a byte count here.

### 3. Free-check rule (TN10 ops decision on the proposal)

Adopt `reviews/FREE-CHECK-ENDPOINT-RULE.md` points 1–5 and 7, with these decisions:

- **`tn10-node.kaspa.com` is added as a candidate.** Each pass the free check dials it with the others and applies the same test: answers, synced, DAA moving between two reads, and an identity distinct from the two kept nodes and from our own desk and Mini. If it passes, it is a free node and the bot may send its normal-rate HOLD-4 there. If it fails, the file stays `NO SEND no-free-node`.
- **Names that time out** are dropped from the active dial list for the night, but every pass still logs them (as a count and the reason, no hosts in public files). A dropped name can come back only by a TN10 ops note.
- **Raw-IP wRPC nodes found by scanning or in peer address books are read-only:** observation (version, sync, fee estimate, template if exposed) for pre-run 29 and propagation reads only. **No sends of any kind** to them, normal-rate included. They are never a free node.
- The public `NO SEND` / HOLD-4 file records the distinct count and the reason only.
- **Why:** FINDINGS 80 found 2 distinct nodes behind the public names, `tn10-node.kaspa.com` as a third named node, and other wRPC nodes only by scanning. Those were not published as public endpoints, so we do not send to them.

### 4. Pace and depth (new; TN10 ops rule)

The plan had no such section. This is the rule:

- **Quality first.** A run counts when its target is met with clean, published files, not when it is fast. Speed (pre-run 25) only after the combined target (pre-run 24) is met.
- **One probe at a time.** One run open at a time, one knob changed per run, one runner per machine. No overlapping probes, no second runner.
- **Loop on fails.** A missed target is not abandoned: write the reason, change one thing, log it in `retry-log/README.md`, retry in the next numbered repo. A void (outage, as pre-run 21) is retried unchanged.
- **Depth over breadth.** Do not skip to probes 27–30 to escape a failing 24; they wait for 24 met or a written reason it cannot be met (plan B).
- **No time lock after 23:30**, but the box can pause: keep blocking waits around HOLD-3 and the pin, and resume from the run's progress file.

### 5. Process safety, restated

Never stop or restart desk kaspad, serve or keeper. Mini: start from existing data if down, never wipe. No devnet. Modest mining; no extra miners. Pre-run 28's filter cuts only the desk–Mini peer path, is removed at the end, and its removal is checked and logged before RETURN. Pre-run 28 also writes that Mini's count is not comparable during the cut.

### 6. Records (hard rule)

Every run, done, failed or void: its own public repo in the pre-runs 1–23 shape plus `Target`, `Met / not met`, `Retry count and which run it retries`, and core-target tags; a row in `runs/README.md` and `retry-log/README.md`; and, on completion, **a tn-master `repos/INDEX.md` row and a README headline row** (Storm | Best number | Counter | Repo, UTC window from `logs/PRE-RUN-OPEN.md` to the runner's end, counter named, "Not Pulse's count" where it applies). FINDINGS and OBSERVED only when the run warrants it.

## Approved probe order, pre-run 24 onward

| # | Probe | Target | Gate | Planning cap → funding move (10×) |
|---|---|---|---|---|
| 24 | Combined whole, modest: 4 covenant families at the node-mass floor, one fresh KCC-20 launch (one mint at a time, cap 30), one tic-tac-toe carrier if the runner is already on disk | One covenant hop, one mint and one guest carrier accepted on the desk node in the same open window, desk process unchanged, disk line held, bot legal | Review done (this file), 23:30 Brussels, both nodes verified, disk floor written, BUDGET_CHECK passed | 5,300 → 53,000 tKAS (minimum 3× = 15,900) |
| 25 | Same whole, one knob faster | All three still land; the first component to fall behind is named with the load at that minute | 24 met | 20,000 → up to 200,000 |
| 26 | One held 2× fee step on that mix with our lane at ready cap 8 | Table of landings, template and fee estimate at baseline / 2× / zero; lane back to zero | 25 met (or ops records why not) | 15,000 → up to 150,000 |
| 27 | Post-v2.1.0 RPCs, gated on the binary's version | Each RPC the binary has passes its line; missing ones are honest `not met` | 24 met or blocked with a written reason | 1,000 → 10,000 |
| 28 | Desk–Mini soft partition, no restart | Accepted ids leave the mempool within the declared window after restore, or the linger is logged against #1146/#1147 | same | 2,000 → 20,000 |
| 29 | Public compare, desk v2.1.0 against one verified distinct node (reads; normal-rate submit only to a free published node) | Paired table filled, or `NO SEND` with the distinct count | Free check per change 3 run first | 3,000 → 30,000 |
| 30 | Disk-gated edges: coinbase reject, script-mass pair, ZK verify if a receipt exists, IBD only on a disposable node | Each check passes, fails with its error kept, or is `not met` with a written reason | Disk check written | 1,000 → 10,000 |

Funding above is the default 10× move from the mining wallet; anything between 3× and 10× is fine, logged. The key-0 BUDGET_CHECK (change 1) still decides whether a run may open.

**First approved probe: pre-run 24.** Target: one covenant hop, one KCC-20 mint and one tic-tac-toe carrier accepted on the desk node in the same open window (guest absent → its line `not met` with the reason, and 25 does not start). Funding need: planning cap 5,300 tKAS; move about 53,000 tKAS (at least 15,900) from the mining wallet as a logged step, and pass BUDGET_CHECK (key 0 projected ≥ 26,000 usable, ≥ 2,500 coins over 3 tKAS) before genesis. Earliest arm 23:30 Brussels, 13 Nov 2026.

## Not done by this review

Nothing was armed. No node, miner, sender or runner was started. tn-master was not changed by this review. The PDF `plan/tn10-test-plan-tonight.pdf` is not regenerated; this file and plan section P are the binding text.
