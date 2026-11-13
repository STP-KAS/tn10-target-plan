# Headline check, 13 Nov 2026

Testnet-10 only. We checked the live tn-master landing page, not the snapshot in `history/snapshot/`. Live tip when this note was written: `4465ac9cb7db0879a059f83cfc5ac7c1aaf673ff` (2026-11-13T18:19:34Z). The headline rows for pre-runs 10–23 and the four older runs are in commit `04d18be`. We did not re-add or rewrite them. Corrections welcome.

The result column was checked against each run's own `logs/LESSONS.md`, `logs/FAILED.md`, or `README.md`, and against tn-master `FINDINGS.md`. Quoted lines below are from the run file unless we say otherwise.

## Result column

These rows match the run file on the reported result. We left them as they are.

| Row | What matched | Run file |
|---|---|---|
| 25 Sep, Build wallet load | Peak offered 1162 tx/s for 0.29 s (340 txs), all included, no local node | `tn10-storm-2026-09-25-build` README: "Peak we offered: **1162 tx/s** for 0.29 s (340 txs, 8 RPC connections, 256 in flight). All accepted, all included." and "Not a local mempool, because there was no local node." |
| 26 Sep, round 8 | 1,191 / 1,196 completed; 7,894 / 7,894 illegal spends rejected; 1,120.8 tx/s in the full-rate 26 min; window 16:34–18:00 CEST | `tn10-storm-2026-09-26-r8` README tables |
| 27 Sep, desk CPU miners | Not a tx rate | `tn10-storm-2026-09-27-desk-miners-public` README is a miner test. It records a hashrate, not a tx/s headline. The row is right to leave the tx column empty. |
| 10 Oct, public-node test | About 3,168 tx/s submitted (about 2,969 accepted) on 22 senders; clean hold about 880–985 tx/s on 14 senders; 12:23–14:18 UTC | `tn10-storm-2026-10-10-public-nodes` README |
| Pre-run 10 | Included as sent at 1,013, 1,500 and 1,800; 1,607,515 submit-OKs, all included; cheap tiers already slow at 1,013. Open 07:24:33Z, runner ended 07:53:38Z | LESSONS |
| Pre-run 11 | 923,812 submit-OKs, all included; 400 / 700 / 1,013 each "included within 10 percent" on every scored minute; floor tracked ready mass more than our offer (rank −0.93 with ready mass, −0.26 with our submit-OK). Open 08:59:00Z, ended 09:46:41Z | LESSONS |
| Pre-run 12 | 40,440 hops, every OK hop landed; 48.5–49.5 per family a minute with the stream absent; with it present, medians 76 / 77 / 82 / 87 / 92 percent. Open 10:37:33Z, ended 11:46:41Z | LESSONS and METHOD |
| Pre-run 13 | 40,830 lane transactions, every OK hop landed; N = 10 kept 95–101 percent; the 8 percent and the 67 percent are both in the N ≥ 40 steps (floor at N = 40 and rate 126; r200 on the way down at N = 40). FAILED 2026-11-12T15:17:53Z. Open 13:10:06Z | LESSONS and FAILED |
| Pre-run 16 | Median ratio 1.96; lane 22,258 of 22,258 included | LESSONS |
| Pre-run 18 | 150 → 1,405 in about 21 minutes; medians 548 at the reference, 562 and 560 in the two greedy parts | LESSONS |
| Pre-run 19 | 150 → 719 in 7 decided minutes; landings median 518 against a reference of 513 | LESSONS |
| Pre-run 20 | 150 → 368; at 460 the template median was 471,954 mass with 8 chains ("about 472,000", "stayed full") and 348,296 with 30 ("about 348,000") | LESSONS |
| Pre-run 22 | 235–239 a minute at 460 and 201–220 at 2,000 with 8 chains; templates under 400,000 mass in 7, 20 and 38 percent of samples with 8, 15 and 30 chains | LESSONS |
| Pre-run 23 | R = 8 → 15 → 30 gave 7 → 30 → 88 percent under 400,000; 233–244 a minute at 2,000; the 460 segments in the same table span 231–240 | LESSONS. One 8-chain segment at R = 8 is 14 percent, and the summary also says 7–14 percent across the three 8-chain segments. The headline's single 7 is the summary's R = 8 figure, not every 8-ready segment. |

## Mismatches

We did not edit tn-master.

### Clocks on pre-runs 14, 15, 16, 17, 18, 19, 20, 22 and 23

The parenthetical UTC window on these headline rows is earlier than `logs/PRE-RUN-OPEN.md`, and it ends after the live run. The result text is a separate question and is covered above or below.

| Pre-run | Headline window (UTC) | `PRE_RUN_OPEN` | Live run in LESSONS |
|---|---|---|---|
| 14 | 17:54–20:09 | 2026-11-12T18:19:20Z | `RUN end` 19:57:44Z |
| 15 | 20:12–22:15 | 2026-11-12T20:44:17Z | desk runner 20:45:18Z to `RUN end` 22:10:44Z |
| 16 | 12 Nov 22:27 – 13 Nov 00:45 | 2026-11-12T23:10:34Z | desk runner 23:11:56Z to `RUN end` 00:37:41Z |
| 17 | 00:47–02:31 | 2026-11-13T01:28:26Z | desk runner 01:30:40Z; FAILED 02:12:41Z |
| 18 | 02:27–04:30 | 2026-11-13T03:06:51Z | desk runner from 03:07:40Z; `RUN end` 04:23:43Z |
| 19 | 04:32–05:53 | 2026-11-13T05:08:02Z | desk runner from 05:08:52Z; `RUN end` 05:44:42Z |
| 20 | 07:08–08:50 | 2026-11-13T07:53:53Z | on origin 07:53:54Z; `RUN end` 08:43:06Z |
| 22 | 10:40–12:30 | 2026-11-13T11:35:26Z | on origin 11:35:26Z; `RUN end` 12:10:06Z |
| 23 | 15:17–17:15 | 2026-11-13T16:08:45Z | on origin 16:08:46Z; `RUN end` 16:57:07Z |

Pre-runs 10, 12 and 13 match their open file within a minute, and the end matches the runner end or the FAILED stamp. Pre-run 11's open file is 08:59:00Z; the headline says 09:00, which is the first scored minute, and the runner ended 09:46:41Z.

Pre-run 21's headline window 10:21–10:35 matches LESSONS ("PRE-RUN-OPEN 10:21:17Z" and "published `logs/FAILED.md` at 10:35:00Z"). The FAILED file's own stamp is `FAILED 2026-11-13T10:36Z`.

### Pre-run 14, the "about twice" band

Headline: "A hop at about twice our lane's rate kept 96–104 percent of BASE (76–88 at the lane's rate)".

LESSONS, the ratio table: the 2.00 row is 99% (N = 20) and 96% (N = 40). The 104% cell is the 1.59 row (r200 against a lane at 126, N = 20), next to 96% at N = 40. The prose says: "At the same rate, no: 76–88 percent. … At about 1.6–2 times, within about 4 percent at both N."

The 76–88 figure matches. The 96–104 span matches that 1.6–2 prose band. It is wider than the 2.00 row alone, which is 96–99.

### Pre-run 15, the "about twice" band

Headline: "About twice our uncapped lane's rate kept 95–99 percent of BASE, about three times needed at the heaviest step".

LESSONS prose: "a hop at about twice the lane's rate kept 95–98 percent of BASE … where 2x lost about 5 percent and only 3x held. … needed about 3 times at about 60."

LESSONS ratio table, row "about 2–2.4": 2.38: 99%, 2.0: 98%, 2.0: 95%. The 99% cell is 2.38 times a lane at 126, not the 2.0 rows. The "about three times" clause matches the prose.

### Pre-run 17, the HOLD-3 label

The failure time matches. LESSONS: "At 02:12:41Z, three minutes into the second part of the duel" and, in the same bullet, "HOLD-3, HOLD-4, RETURN and the one-sided variant were not observed."

A later bullet says "HOLD-3 from 02:09" and the minute table labels 02:09, 02:10 and 02:11 as HOLD-3, "from the desk's local logs … never published as a step file." FAILED.md is `FAILED 2026-11-13T02:12:41Z`. The step-down "150 → 120 → 100" "within four minutes" is in the same LESSONS file. The headline's "into HOLD-3" follows the later bullet and the local minute table. It does not follow the opening bullet's "not observed," which we read as "not published as a step file."

### Pre-run 21, "No data"

Headline: "No data: the desk and the Mini lost internet from about 10:25Z to 10:33Z (a robot vacuum knocked the network switch). No findings."

LESSONS: "From about 10:25Z to 10:33Z the desk and the Mini lost their internet connection: a robot vacuum knocked the network switch they share." and "So these minutes say nothing about the network, and there are no findings from this run."

The same file's spend section: "Lane: 207 transactions accepted, 0 rejected, 0 lost" and "About 540 tKAS in all." The "no findings" sentence matches. "No data" does not match that spend section. `repos/INDEX.md` row 68 already records "About 540 tKAS spent" and "no usable data." We did not add the spend figure to the headline.

## Still missing, and what we did not add

Checked `repos/INDEX.md` at the same live tip (file size unchanged from the snapshot; the new headline rows are on the landing page).

- Rounds 2–6 each have an INDEX row (`…-r2` through `…-r6`). The headline folds them into one row, "25-26 Sep, rounds 2-6," linking the hub repo. They are not absent.
- Pre-runs 1–9 each have an INDEX row. The headline keeps them as one combined row. They are not absent.
- The 2 Oct ramp, ledger and match repos are marked in INDEX as merged into the full-gusto run. The headline links the public copy.
- 10 Nov (`tn10-storm-2026-11-10`) is INDEX status "not run (named, not armed)." The 11 Nov neuron is "not run (plan, not armed)." Neither has a result row. We did not invent one.
- 7 Oct: the headline "mass ceiling" links `what-limits-tx-rate`. INDEX calls that repo "a general note, not a run" and records the run as `tn10-storm-2026-10-07` (row 30), outcome "About 304-308 payments per block, about 3,040-3,080 tx/s". The figure is on the headline. The run repo is not the link. We did not change the link.
- tn-master FINDINGS, after item 80, says the late-October and early-November a4–a26 loop was not re-opened as a full score table. We did not invent rows for it.

## Tonight, from pre-run 24

GitHub search `org:STP-KAS prerun-24 in:name` returned total 0. No completed tonight run was found, so no headline row was added. A separate per-run repo is fine. When a run completes, it also needs a tn-master headline row in the same four columns (Storm, Best number, Counter, Repo), the counter named, and "Not Pulse's count" where that is the counter, plus a `repos/INDEX.md` row. That write has not been done, because the run has not happened.
