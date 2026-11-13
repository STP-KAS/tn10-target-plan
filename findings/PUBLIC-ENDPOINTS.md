# Public endpoints and the free check

For issue #1. Testnet-10 only. Counts only. No hosts' IPs, ports, keys, addresses, node ids or txids. We did not send, and we did not scan again. Corrections welcome.

## Hypothesis

Issue #1 states the working hypothesis: the free check only reaches two public TN10 nodes because the bot's private config hardcodes eight wRPC names under the public `*-10.kaspa.*` pattern, and many of those names are aliases of one node. It is not peer pinning on our kaspad, DNS-seed behaviour, `ks_bridge`, or bore.

We agree with that hypothesis for the free check's result. We did not open the private config ourselves. A search of public STP-KAS code for `no-free-node` returned no file. The evidence we can cite is the run files and tn-master FINDINGS 80.

## What the run files say

Pre-run 11 LESSONS: "in its pass at 09:28:30Z every answering endpoint was one of the desk's two kept kaspads."

Pre-run 16, as recorded in tn-master FINDINGS 54 from that run's LESSONS: "the kept public nodes were 2 distinct kaspads and every other answering endpoint was one of them, so no free node."

The same two-node result is what the later pre-runs file as `NO SEND no-free-node`. That is the free check's outcome. It does not, by itself, show the eight names. Issue #1 and `NODE-DEEP-DIVE.md` are where TN10 ops records that the list is eight hardcoded names, that one node answers on seven names, that another answers on one name, and that several names time out.

## What FINDINGS 80 adds

Live tn-master `4465ac9`, FINDINGS 80, read-only, 13 Nov 2026:

- Public `*-10.kaspa.*` names (201 tried, 18 resolve) and the kaspa wasm resolver for testnet-10 (80 calls, 58 answered, 5 distinct URLs) led to only 2 distinct nodes, plus `tn10-node.kaspa.com` as a third named node.
- Over every wRPC endpoint that answered, from the names, the resolver, the seeds and the peer address books: 9 distinct nodes, 8 synced. One address answered as two different nodes on different calls.
- P2P, after dropping hosts that also accepted connections on ports nothing should listen on: about 39 plausible reachable nodes. The 43 on a dashboard tile is the operator's reading. Our scripted load of that page showed no number. FINDINGS 80 marks the "43 counts P2P" reading as an inference, label C.

FINDINGS 80's own limit for our runs: "this does not change finding 29: the bot needs a third distinct public RPC node that is synced, and those other wRPC nodes were found by scanning, not published as public endpoints."

## The other mechanisms

- Peer pinning. Issue #1 records that desk kaspad was started with `--testnet --netsuffix=10 --utxoindex --disable-upnp` and with no `--connect` and no `--addpeer`. We did not re-read that process. The Mini's command line is still unread, as the issue says.
- DNS seeds. The free check, as ops describes it, does not dial the seeds. It dials the hardcoded list. FINDINGS 80's wider read, which did use the seeds and address books, is what reached 9 wRPC nodes and about 39 P2P hosts. That is a different path from the free check.
- `ks_bridge` and bore. Issue #1 records that box node n0 is not running, its data dir is gone, and no kaspad, `ks_bridge`, bore or miner was running on the box. We did not re-check the box.

## Would the resolver, or `tn10-node.kaspa.com`, give more distinct nodes?

On the FINDINGS 80 pass, the resolver's 5 distinct URLs still collapsed to the same 2 nodes. Adding the resolver to the free check would not, on that pass, have produced a third distinct node.

`tn10-node.kaspa.com` is recorded as a third named node, separate from those two. FINDINGS 80 does not say that this name was one of the 8 synced wRPC nodes, and it does not say the free check may send to it. The 9 wRPC nodes include endpoints found only by scanning. Those stay off the free check until TN10 ops publishes them as endpoints.

## Proposal

The rule we would have ops review is in [reviews/FREE-CHECK-ENDPOINT-RULE.md](../reviews/FREE-CHECK-ENDPOINT-RULE.md). It is a proposal. It does not arm a send.
