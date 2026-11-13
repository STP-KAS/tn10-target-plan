# Build task: Windows tic-tac-toe guest runner

For Grok Build. Written by TN10 ops on 14 Nov 2026 (Europe/Brussels). Not armed by this file. Kaspa Testnet-10 only; tKAS has no value. Never mainnet, never the desk devnet.

This is a request to produce a native Windows x86_64 runner that can play one tic-tac-toe match against the desk's already-running local TN10 kaspad (2.1.0, loopback only). Heavy work is on the desk. Do not restart, stop, or reconfigure that kaspad.

Hand back a DONE note in this repository when finished. TN10 ops reviews the result before it is used in a run.

## Goal

Windows x86_64 `.exe` builds of `ttd` and `ttflow` (and `ttloop` only if a usable source for it is found; see below), at the **same pins as the existing Linux kit**, plus the guest ELF, that can play one full match of nine carriers against the local TN10 node:

Init, Deposit A, Deposit B, CreateGame, JoinGame, Turn A, Turn B, Withdraw.

(Transfer is off by default in upstream `ttflow` and should stay off.)

Any one carrier accepted on the desk node would meet the plan's guest line; the runner still records how many of the nine landed, or the exact rejection. Exec mode only: `TT_PROVE=0`, `RISC0_DEV_MODE=1`, no CUDA, no prover, no settler.

## Pins (do not silently change them)

The Linux binaries already on disk, checked on 13 Nov 2026 by `tools/ttt-guest-runner/bin-check.sh`, embed these pins and hashes. A landing with this set is evidence about this older tree, not about the November pull requests or the plan's later pin.

| Piece | Repository | Commit we observed | Notes |
|---|---|---|---|
| Host crates / `ttd` + `ttflow` source | [biryukovmaxim/vprog-tictactoe](https://github.com/biryukovmaxim/vprog-tictactoe) | `803a120ba1449c1ecbadef46dd68586b8ce803f6` (2026-09-26, `encoder-wasm, web: price wasm-built carriers at the priority-bucket estimate`) | This commit's `Cargo.lock` is the one that records the two pins below. Checkout this commit and build `--locked`. |
| vprogs | [kaspanet/vprogs](https://github.com/kaspanet/vprogs) | `bcebf5998e81296cd50ca635e9c0b32177df454f` (`l1/wallet: slice-refs without clones in the fee-policy tests`, 2026-09-26) | Manifests at `803a120` say `branch = "release-candidate"`. That branch moves. The lock file pins `#bcebf5998e81296cd50ca635e9c0b32177df454f`. Do not `cargo update`. |
| rusty-kaspa | [kaspanet/rusty-kaspa](https://github.com/kaspanet/rusty-kaspa) | `eb0a856d4e1ef9d884c5997bc43408091f5a5632` | Rev-pinned in `Cargo.toml` and `Cargo.lock` at `803a120`. Arrives through cargo git; no separate checkout is required to compile the host bins. |
| Guest ELF (Linux kit) | built from the guest crate at the same tictactoe pin | sha256 `08a40dd7a9dcfc6fae2aa8e997b20ac7adcb82a5b430397b1dbe0803d6fe2de0` | RISC-V `riscv32im-risc0-zkvm-elf` artifact. It is not a Windows binary. Prefer to reuse this file rather than rebuild. |
| Backend ELFs | committed in vprogs at `bcebf59` | batch-processor sha256 `df0b6f604761e23bd95f8b335e5924394987ffcf206250b21836fb7b843ecca3`; batch-aggregator sha256 `02973d917ff758ee2ee388dec4bcd3c26273909f3d5a0bc59b23b3849d4e2d7d` | Extracted, not built: `git show bcebf59:zk/backend/risc0/batch-processor/compiled/program.elf` and `…/batch-aggregator/compiled/program.elf`. |

Linux kit sha256 values, for identifying a copy of those files only (they are ELF, not `.exe`):

- `ttd` `f753027146c3a8b88beb09eec1d36f67650e0cef84e17edfb50447c56fd63bc4`
- `ttflow` `80e6044734d6f0665bc140d7337b1e01598ff697ff139f825624445b92fbd696`
- `ttloop` `710a9b2f4d9d15c4ab54ff9153f46e724efd3e1f51197b8f8d471ddf9a824f1c`

The plan's named pin is different and is **not** the default for this task: vprog-tictactoe `d97ee421f78ba6f9bc8bb8b6b8300878a9dcc59a` (2026-11-06, message `pin vprogs release-candidate 6d068974`) locks vprogs `6d06897408480396b9f9ffbe61c9ea10bb7281a8`. rusty-kaspa is still `eb0a856…` at that tip. If `803a120` will not compile on the desk's MSVC rustc, record the exact compiler error, and only then consider the later pin. Say so plainly in the DONE note: a landing on `6d068974` is evidence about that later tree, not about the Linux kit.

## What the existing Linux kit already does

Source of truth: `tools/ttt-guest-runner/` in this repo at `04db647`, and the matching folder used on the box. Nothing in that kit was compiled. It drives binaries that were already on disk. It has not sent anything yet. The offline shape check and one read-only node read are recorded in that folder's README and logs.

| File | What it does | Network |
|---|---|---|
| `lib.mjs` | Payload layout and carrier shape (lengths taken from the Rust layout) | none |
| `keygen.mjs` | Creates two fresh guest keys once (issuer for `ttd`, operator for `ttflow`). Not kit keys 0, 1 or 2. Mode 600, never printed. | none |
| `offline-check.mjs` | Signs Init, Deposit and Turn shapes over a made-up coin; checks mass, fee and scripts. SDK 2.1.0. Observed masses: Init 1,086; Deposit 10,016; Turn 994. | none |
| `bin-check.sh` | sha256 and embedded pins; extracts the backend ELFs; starts `ttd` and `ttflow` against a closed loopback (no node reachable). Observed exits were the timeout (124). | none |
| `readonly-check.mjs` | One node, reads only: network id, sync, DAA moving, version, fee estimate, the two guest keys' coins. Never submits. Node URL comes from env or a private file and is not printed. | read |
| `arm-guest.sh` | `--dry` (default): gates only, nothing started. `--live`: gates, then `ttd` in exec mode on a fresh lane, then one `ttflow` match. | send (live only) |
| `stop-guest.sh` | Reads the DA once (games by status open / playing / finished), then stops that run's `ttd`. | none |

`--live` gates, taken from `arm-guest.sh`: a run directory is set; a local env file supplies `TT_WRPC_URL`; there is no STOP file; `ttd`, `ttflow`, the guest ELF and both backend ELFs are present; the read-only check reports `network=testnet-10`, synced, DAA moved; the guest issuer holds 2–4 coins and the guest operator 1–4 coins, each at least `TTT_MIN_COIN_TKAS` (default 20 tKAS). Live also requires the run's own arm file (`control/ARM-GUEST`) written after PRE-RUN-OPEN. The phase log uses fixed tokens only (`GUEST gate ok`, `carriers_submit_ok=N`, first step, first error with ids stripped). Txids, lane and covenant ids stay in the run's private directory.

`ttflow` at `803a120` (`driver/src/scenario.rs`) logs acceptance as `Step N (Name) accepted: {txid}`. The nine default carriers are Step 1 Init, 2 Deposit Player A, 3 Deposit Player B, 4 CreateGame, 5 JoinGame, 6 Turn Player A, 7 Turn Player B, 8 Withdraw. Step 5.5 Transfer runs only when `TTFLOW_TRANSFER_AMOUNT` is set; the default is 0.

`ttloop` is a local load runner (header: "grok-bot round 3, 2026-09-26"). It is **not** in biryukovmaxim/vprog-tictactoe at `803a120` or at `d97ee421` (contents request for `driver/src/bin/ttloop.rs` returned 404 at both). One match does not need it. Do not invent a copy or commit a key-path default into this repo. If a usable `ttloop` source or Windows binary turns up on the desk search, it may be ported as an extra; it is not an acceptance requirement for one match.

Upstream crate layout at `803a120` (`Cargo.toml` comments and README):

- `node/` package `vprog-tictactoe-node`, bin `ttd` (`node/src/main.rs`): runner driver + DA (`/api/state`, `/api/config`, `/api/games`, …).
- `driver/` package `vprog-tictactoe-driver`, bin `ttflow` (`driver/src/main.rs`): scripted scenario.
- `guest/` (excluded from the workspace): RISC0 guest, own lock and toolchain, bin `vprog-tictactoe-guest`.
- Environment names are in upstream `docs/demo/reference.md`. The ones the Linux kit actually sets for a TN10 exec-mode match: `TT_NETWORK=tn10`, `TT_WRPC_URL`, `TT_PRIVATE_KEY` (`ttd` issuer), `TTFLOW_PRIVATE_KEY` (`ttflow` operator), `TT_PROGRAM_ELF`, `TT_BATCH_ELF`, `TT_AGGREGATOR_ELF`, `TT_DATA_DIR`, `TT_PROVE=0`, `RISC0_DEV_MODE=1`, `TT_START_MODE=fresh`, `TT_DA_BIND`, `TT_LANE_ID`, `TT_COVENANT_ID`, `TTFLOW_STEP_DELAY_MS` (kit default 2000), `RUST_LOG=info`.

Funding need, already written in the kit README and not re-measured here: about 2.03 tKAS per match plus `ttd`'s still-unmeasured bootstrap transaction. Build does **not** move coins from the mining wallet. If the dry gate fails on funding or coin counts, stop there and record it. Ops funds as a logged step before any live send.

## Numbered tasks

1. **Desk search first.** On the desk (Windows 11; public path form `C:\Users\Fermi\...`), search for an earlier native Windows (or clearly desk-usable) build: `ttd.exe`, `ttflow.exe`, `ttloop.exe`, `ttt-guest-program.elf`, backend ELFs, surrounding folders, and leftover WSL copies. Record what was found (path in the public form above, sha256, embedded vprogs / rusty-kaspa pins if the strings are present, file type). Linux ELF binaries found under WSL are **not** a usable native Windows runner. A copy is usable only if it is Windows x86_64, the pins match `bcebf59` / `eb0a856` (or a deviation is written down), the guest ELF hash is the one above or is recorded, and the bins start against a closed loopback with no send. If usable, wrap that copy (steps 5–8) and skip the from-scratch compile. If nothing usable is found, say so and continue from step 2. Do not restart kaspad to complete the search.

2. **From-scratch toolchain on the desk** (only if step 1 finds nothing usable). Install what is needed for a native Windows build, not a cross-compile from elsewhere and not a WSL-only binary:
   - `rustup` with the MSVC host/target `x86_64-pc-windows-msvc`. Manifests at `803a120` declare `edition = "2024"`; use a current stable rustc that supports that edition. We did not recover a rustc version string from the Linux binaries, so we do not name one.
   - Git, and the MSVC build tools `rustup` expects for this target (the host crates pull RocksDB through vprogs). If the compile fails, record the exact error; do not invent flags we have not run.
   - A RISC0 / `rzup` toolchain, or Docker with the upstream `just build-guest-docker` image `risczero/risc0-guest-builder:r0.1.97.0`, is needed **only** if the prebuilt guest ELF is not reused. Prefer reuse.

3. **Checkout and build commands** (from-scratch path). On the desk, clone the two source repos and check out the pins above. From the vprog-tictactoe work tree at `803a120`, with its committed `Cargo.lock`, and without `cargo update`:

   ```
   cargo build --release --locked -p vprog-tictactoe-node
   cargo build --release --locked -p vprog-tictactoe-driver
   ```

   That is the upstream package/bin mapping (`ttd` from `vprog-tictactoe-node`, `ttflow` from `vprog-tictactoe-driver`). Do not enable the `cuda` feature. Expected outputs: `ttd.exe` and `ttflow.exe` under the release target directory. Extract the two backend ELFs from vprogs at `bcebf59` as in the pin table (same method as `bin-check.sh`). Reuse the prebuilt guest ELF whose sha256 is in the pin table. If the guest ELF must be rebuilt, the upstream recipes at this tree are:

   ```
   just build-guest
   ```

   which runs `cargo +risc0 build --release --target riscv32im-risc0-zkvm-elf` in `guest/` and copies `target/riscv32im-risc0-zkvm-elf/release/vprog-tictactoe-guest` to `guest/compiled/program.elf`; or `just build-guest-docker` (no local rzup). Record the new sha256 and do not call it the September ELF.

   After the build, record sha256 of the `.exe` files and the ELFs, and the rustc/MSVC versions used.

4. **Closed-loop start check** (no send). Equivalent of `bin-check.sh`: point `ttd.exe` and `ttflow.exe` at a closed loopback wRPC URL so no node is reachable, with a throwaway key that is never funded and is discarded, `TT_NETWORK=tn10`, exec-mode env as above. Record that they start and that they make no other contact. Do not print the throwaway key.

5. **Config via env or a local file, never via git.** Node URL, DA bind, data dir, and key file path come from environment variables or a local env file that is not committed. Required names are those in the kit and in upstream `docs/demo/reference.md`. Defaults that must be forced: `TT_NETWORK=tn10`. Refuse to run if the node is not testnet-10. Keys live in a local file (path via `TTT_KEYFILE` or equivalent), restricted ACLs, never printed, never written into this repo or into committed logs.

6. **PowerShell wrapper**, equivalent of `arm-guest.sh` / `stop-guest.sh`:
   - `arm-guest.ps1 -Dry` (default): gates only; nothing started; no send.
   - `arm-guest.ps1 -Live`: same gates, then start `ttd.exe` in exec mode on a fresh lane, wait until the DA yields a lane, run one `ttflow.exe` match, leave `ttd` up for the DA read.
   - A stop script that reads the DA once (games by status) and stops that run's `ttd`.
   Live still requires an explicit arm file written for that run. The wrapper must refuse mainnet and refuse to start if the read-only gate fails.

7. **Counter output.** For each of the nine carriers: accepted or rejected, with the exact node rejection text when the node rejects or does not take the submit. Public/phase output follows the Linux kit: fixed tokens, `carriers_submit_ok=N`, first step, first error with 64-hex ids, `kaspatest:` addresses and node URLs stripped. The full rejection text may be kept only in the run's private log. `ttflow`'s "accepted" means the node took the submit, not that a block accepted it; the desk counter should also confirm landing on the desk node, as the kit README says.

8. **Dry run on the desk**, against the already-running local TN10 node (read only). Must end with a clear gate result. If funding is short, that is a recorded gate failure, not a skip ahead to live.

9. **Live match**, only after the dry run has passed and ops has funded the two guest keys (logged) and written the arm file. One match, nine carriers, TN10 only, desk node only. Success is 9/9 taken by the node (and confirmed on the desk), or a stop at the first rejection with the exact node text. Do not retry by restarting kaspad. Do not open a live send "to see" while dry still fails.

10. **Release and hand-back.** Commit under `tools/ttt-guest-runner/windows/`: a short README (pins, sha256, how to run dry/live, what was searched on the desk), the PowerShell wrapper, a SHA256 list, and a `DONE.md`. Put the `.exe` files and any large ELF copies on a GitHub release for this repo as assets; do not commit large binaries into git. Link the release from `DONE.md`. Then stop. TN10 ops reviews before the wrapper is used in a pre-run.

## Acceptance

- The desk search is written down, including a negative result.
- If a from-scratch build was required, it was done on the desk at the pins above (or a pin change is explicit, with the compiler error that forced it).
- Dry run passes on the desk, or the exact gate failure is recorded.
- One live match lands 9/9 carriers or records the exact rejection text.
- Release assets + sha256 are published; `DONE.md` is committed; wrappers are in `tools/ttt-guest-runner/windows/`.
- Nothing in the public files or the issue thread lists hosts, IPs, ports, keys, addresses, covenant ids, or transaction ids. Public paths use `C:\Users\Fermi\...`.

## Constraints

- TN10 only. Never mainnet, never the desk devnet.
- Never stop, restart, or reconfigure the desk kaspad.
- No secrets in git. No hosts, IPs, ports, keys, addresses, covenant ids, or transaction ids in public files, commit messages, release notes, or issue text.
- Public paths read `C:\Users\Fermi\...`.
- Do not touch `ADVICE-TO-DEVELOPERS`, `DISCLAIMER.md`, or credits.
- No force-push.
- Humble "we observed" tone in anything committed.
- This file does not arm a run and does not authorize a send on its own.

## Hand-back

Commit `tools/ttt-guest-runner/windows/DONE.md` (and the wrapper + sha256 list). TN10 ops reviews that note and the dry/live logs before the runner is wired into a pre-run guest line.
