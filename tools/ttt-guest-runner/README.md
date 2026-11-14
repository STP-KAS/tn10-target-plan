> **Experimental. We are just trying this.** Kaspa Testnet-10 only; tKAS has no value. Never mainnet, never the desk devnet.
> This folder is a tool. Reading it does not start a machine, arm a runner, or send.

# Tic-tac-toe guest carrier runner

This is a small kit for the guest line of the combined probe (plan section C, card 24; REVIEW-01 row 24): "one guest carrier accepted on the desk node in the same open window". Pre-run 24 marked that line `not met` because no runner was on disk. This folder is our attempt to have one ready from pre-run 25 on. It has not sent anything yet. Corrections are welcome.

## Changes after the first live run (14 Nov 2026)

- `arm-guest.sh` now takes the lane id from `ttd`'s own start line (`lane id=<u32>`), falling back to the first four bytes of the DA state's `lane_subnet` read big-endian. The DA state has `covenant_id` and `lane_subnet` but no `lane_id`; the old read passed `undefined` and `ttflow` stopped on its config before sending (pre-run 24 retry 1, fixed by hand during that run).
- The result greps no longer end the script under `pipefail` when nothing matches.
- One match is eight carriers (not nine).
- First live result: 8 of 8 carriers accepted on the desk node ([pre-run 24 retry 1](https://github.com/STP-KAS/tn10-storm-2026-11-11-prerun-24-retry-1/blob/main/counts/desk/TARGET.md)).

## What a guest carrier is here

The guest is [biryukovmaxim/vprog-tictactoe](https://github.com/biryukovmaxim/vprog-tictactoe), a vprogs guest program (plan section F). A *carrier* is that stack's own word for an ordinary L1 transaction that carries one lane action in its payload: `TX_VERSION_TOCCATA` (version 1), a user-lane subnetwork id (`[lane id, 16 zero bytes]`, KIP-21), one funding input, any extra outputs first, change last (vprogs `app-kit/src/lane.rs`, `signed_carrier_transaction`). The payload is `access list || signers || actions || tail` (`app-kit/src/payload.rs`). A deposit carrier also pays a P2SH covenant deposit output.

One match, as the upstream driver `ttflow` runs it, is eight carriers, one after another: Init, Deposit A, Deposit B, CreateGame, JoinGame, Turn A, Turn B, Withdraw (Transfer is off by default). Any one of them landing on the desk node meets the plan's line; the run records how many did.

## What is used, and what is not

- **No compile.** The plan says not to compile the tic-tac-toe runner or rebuild the guest or settler tonight (PLAN section A, item 3; Risks; section F). Nothing here is compiled. The kit drives the binaries that were already on the box from our 26 Sep retest. Pre-run 24's playbook said no runner was found on the box. That was not quite right: these binaries were on disk under another path.
- **Binaries on disk** (`bin-check.sh` prints these): `ttd`, `ttflow`, `ttloop` built against vprogs `bcebf59` (release-candidate, September) and rusty-kaspa `eb0a856`; guest ELF sha256 `08a40dd7…de0`. This is **not** the `6d068974` pin the plan names. A landing is evidence about this older tree, not about the November pull requests (plan section E). The backend ELFs `ttd` needs (batch processor, batch aggregator) are the ones committed in vprogs at `bcebf59`. They are extracted with `git show`, not built.
- **Exec mode only.** `ttd` runs with `TT_PROVE=0`, `RISC0_DEV_MODE=1`: no prover, no settler, no CUDA. So there are no settlements, and the #169 settlement-mass path is not exercised. The match is executed by the local `ttd` from L1, and its DA (`/api/games`) shows the result.
- **Own keys.** `keygen.mjs` makes two fresh random TN10 keys, a guest issuer for `ttd` and a guest operator for the `ttflow` carriers. They are **not** keys 0, 1 or 2 or any kit key. The file is mode 600 on the box, outside git, and is never printed.

## Files

| File | What it does | Network |
|---|---|---|
| `lib.mjs` | Payload layout and carrier shape (lengths exact to the Rust layout; random ids; signature bytes placeholder) | none |
| `keygen.mjs` | Creates the two guest keys once | none |
| `offline-check.mjs` | Builds and signs Init, Deposit and Turn carrier shapes with the guest operator key over a made-up coin; checks mass, fee and scripts | none |
| `bin-check.sh` | sha256 and embedded pins of the on-disk binaries; extracts the backend ELFs; starts `ttd` and `ttflow` against a closed loopback port | none |
| `readonly-check.mjs` | One node, reads only: network id, sync, DAA moving, version, fee estimate, the guest keys' coins. Never submits | read |
| `arm-guest.sh` | The run's guest line. `--dry` checks the gates only. `--live` starts `ttd` (fresh lane) and one `ttflow` match | send (live only) |
| `stop-guest.sh` | Reads the DA once (games by status), then stops that run's `ttd` | none |

## Offline validation (13 Nov 2026, box, no network)

`offline-check.mjs`, SDK 2.1.0, funding coin 25 tKAS, floor 100 sompi/gram. Each shape was signed with `verify_sig` on, and every check passed: version 1, KIP-21 lane id, Schnorr sig script, operator P2PK input, P2SH deposit output, payload length equal to the Rust layout, under the 100,000 standard mass, fee at least the floor, values balancing. The masses are on the shape (same input, outputs and payload length). They are not the bytes `ttflow` will build.

| Carrier | Payload bytes | Mass (grams) | Storage mass | Fee at 100 sompi/gram | Value out of the key |
|---|---|---|---|---|---|
| Init | 198 | 1,086 | 0 | 0.0011 tKAS | fee only |
| Deposit (1 tKAS) | 118 | 10,016 | 10,016 | 0.0100 tKAS | 1 tKAS to the covenant + fee |
| Turn | 152 | 994 | 0 | 0.0010 tKAS | fee only |

The deposit carrier's mass is storage mass, set by its 1 tKAS output. The others are compute mass. The read-only check against a kept TN10 node at 22:41Z gave: synced, kaspad 2.1.0, UTXO index, DAA moving, fee estimate 100 sompi/gram in every bucket, guest keys 0 coins. `bin-check.sh`: both binaries start and wait on the closed port with no output until the 20 s timeout. They make no other contact.

## Funding need

- **Per carrier:** about 0.001 tKAS fee for an action carrier, and about 1.01 tKAS for a deposit carrier (1 tKAS goes into the covenant). In exec mode nothing settles, so treat deposits as spent.
- **Per match** (eight carriers, two deposits): about 2.03 tKAS, plus `ttd`'s one bootstrap transaction for the fresh covenant. We have not measured that transaction yet; the first live run records it.
- **Funding move:** the plan's guest cap is 100 tKAS. At REVIEW-01's default of 10×, the move is about 1,000 tKAS from the mining wallet, as a logged step: guest operator 4 coins of 200 tKAS, guest issuer 2 coins of 100 tKAS. A few large coins on each key, never fragmented (plan section E, the #169 lesson). `arm-guest.sh` refuses to start outside 1–4 operator coins or 2–4 issuer coins of at least 20 tKAS each.

## How a run arms it

1. In the run's housekeeping: fund the two guest keys (above), logged. Then `./arm-guest.sh --run <run dir> --dry` must end `GUEST gate ok`.
2. After `PRE-RUN-OPEN`, the run's own arm step writes `<run dir>/control/ARM-GUEST`. Then `./arm-guest.sh --run <run dir> --live`, at most one per run (one runner per machine).
3. The phase log (`logs/guest-phase.log`) has fixed tokens only: gate, lane up, `carriers_submit_ok=N`, the first step, the first error text with ids removed. Txids, lane and covenant ids stay in `<run dir>/private/guest/`.
4. The run's desk counter confirms the landing on the desk node (accepted ids read on the desk). `ttflow`'s "accepted" means the node took the submit, not that a block accepted it.
5. At RETURN: `./stop-guest.sh <run dir>` reads the DA (open / playing / finished) and stops `ttd`.

## Still missing before a run can arm it

- **Send path (used in pre-run 24 retry 1).** The binaries are Linux builds; heavy work runs on the desk, so they run there in a local Linux container (Docker Desktop's own WSL2 VM; no reboot, no compile), and `TT_WRPC_URL` in the kit's private `run.env` points at the desk's own TN10 node through Docker's built-in host gateway name. No port is published from the container and nothing is reachable from outside the desk. The kit, the binaries and the backend ELFs are baked into a local image (`COPY`, nothing built); the guest key file and the run directory are bind-mounted, the key file read-only. Before starting Docker Desktop, make sure no other local container stack is set to auto-start (restart policy `no`), or it competes for the VM's memory. The box has no private route to the desk node (no inbound either way), so the box is not a send path.
- **Node compatibility.** The binaries use rusty-kaspa `eb0a856` client code against kaspad 2.1.0 nodes. Whether a v1 lane carrier from this build is accepted by 2.1.0 is the open question that the first live carrier answers.
- **Older pin.** The binaries are `bcebf59` and the guest ELF is a September local build. The plan's named pin is `6d068974`. Moving to it needs a build, which the plan does not allow tonight.
- **Funding** of the two guest keys, as a logged step from the mining wallet.
- **`ttd` bootstrap cost** has not been measured, and the DA's `/api/state` field names are read loosely (`arm-guest.sh` aborts with `no-lane-from-da` if it cannot find them).

## Windows runner (open task)

A native Windows build of this kit, so the guest line can run on the desk without WSL, is an open Grok Build task: [tasks/BUILD-TASK-ttt-windows.md](../../tasks/BUILD-TASK-ttt-windows.md). Desk search first; if nothing usable is found, Build compiles from scratch at the same pins named in this README. That task is not an arming.
