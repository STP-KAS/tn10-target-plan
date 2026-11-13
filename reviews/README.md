# Reviews

TN10 ops reviews this plan before anything is armed. Nothing in this folder is an approval until a `REVIEW-NN.md` file says so.

One file per change, named `REVIEW-01.md`, `REVIEW-02.md`, and so on. The plan change is a normal commit that names the review file. No force-push. Testnet-10 only. Never mainnet.

Each review file records:

- Plan version reviewed: the git commit of `plan/PLAN.md` that was read.
- Reviewer: TN10 ops.
- Time: Europe/Brussels.
- Verdict: approved, approved with changes, or not approved.
- What changed: section, run, or value, written as before to after.
- Why: the reason or the evidence, with a source.
- How: the reasoning behind the chosen fix.

A missing review file means the plan is not approved. The first commit of this repo is the draft, not a review.
