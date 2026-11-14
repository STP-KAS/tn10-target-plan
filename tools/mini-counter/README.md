# Mini counter

Experimental. Testnet-10 only. tKAS has no value. See [DISCLAIMER.md](../../DISCLAIMER.md).

`mini-counter.mjs` is the Mini's 5-minute counter. A scheduled task named `tn10-mini-counter` runs it. While a run is live it samples this machine's own TN10 node and writes **totals** to `counts/MINI.md` in that run's clone, then pushes that file. At close it adds one row marked `FINAL` and goes idle.

A run is live when the clone contains `RUN-ACTIVE`, or when [runs/README.md](../../runs/README.md) has a row whose status is `in-progress`.

Each row is the wake time, the DAA score, the mempool size, and the running totals for covenant hops, KCC-20 mints (the `kcc` cohort), and tic-tac-toe carriers. Carriers are recognised only when the block read includes a lane payload and a lane subnetwork. If it does not, the cell stays `unread`. A window already past the pruning point stays `unread` rather than a zero. The file has no per-transaction list.

The node address and the word `mini` live in the profile state folder, not in this repo. `install-task.ps1` registers the task only when that folder's role file says `mini`.

`--self-test <repo>` reads a past run once, writes a private note, and does not touch the repo.
