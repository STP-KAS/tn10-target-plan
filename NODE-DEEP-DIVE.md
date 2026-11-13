# NODE DEEP DIVE: prompt for Grok Build (13 Nov 2026)

Posted by TN10 ops at stp's request. **Testnet-10 only. Never mainnet. Do not fabricate.** Every claim needs a source you can cite: a command output, a log line, a rusty-kaspa file and line at a named commit, or a public page. Label inferences as inferences. This builds on [issue #1](https://github.com/STP-KAS/tn10-target-plan/issues/1), which is the narrow question of why the free check only reaches two nodes. This file is the wide question.

## What TN10 ops found so far (13 Nov 2026, about 18:50–20:05 Brussels, read-only)

1. **Public names.** The public `*-10.kaspa.{red,blue,green,stream}` names and the kaspa wasm resolver lead to only **2 distinct nodes** (same p2p id on many names). `tn10-node.kaspa.com` is a third, separately named node.
2. **FINDINGS 80.** tn-master [FINDINGS 80](https://github.com/STP-KAS/tn-master/blob/main/FINDINGS.md) documents counts only, with no IPs, node ids or ports:
   - a dashboard tile showed 43 public nodes (operator's reading; our own capture showed "-");
   - 2 distinct nodes sit behind the public names;
   - 9 distinct wRPC nodes answered (8 synced), most of them reachable only by raw address;
   - about 39 plausible P2P-reachable nodes (IPv4 only, TCP connect only, accept-anything hosts excluded);
   - the box's DNS returned fake answers, so we used DNS-over-HTTPS.
3. **The bot's private config** hardcodes **eight wRPC endpoints**, all under those `*-10.kaspa.*` names. They collapse to **two live nodes**: one node answers on seven names, another on one name, and several names time out. The free check only dials this list, so it can never find a third node. That is why it files the legal `NO SEND no-free-node`.
4. **Desk kaspad** runs with no `--connect` and no `--addpeer`. It peers normally from the DNS seeds and its address book, and the desk and Mini appear as ordinary peers in other nodes' peer lists.
5. **Nothing TN10-related runs on the TN10 ops computer**: no kaspad, bridge, bore or miner. Box n0 is not running and its data dir is gone.

## Investigate, way deeper

- **Topology.** How are TN10 nodes connected? Who peers with whom, inbound versus outbound, and how many are reachable? How stable is it over time?
- **Hub question.** Is one of the two public-name nodes the basis of everything? Do they act as hubs, bootstrap points or the main block relays, or are they ordinary peers with many DNS aliases? What would happen to TN10 if they went offline? Answer from evidence only (peer lists, the addresses nodes advertise, block relay timing), and label it as an inference.
- **Who maintains the network.** From public sources only: who runs the seeders, the public names, the resolver and the dashboards? What has been publicly stated about how TN10 is maintained?
- **DNS seeds.** Look at the three TN10 seeders in rusty-kaspa `params.rs`:
  - What do they return, and how often does that change?
  - How many distinct addresses do they give, and do they include the two public-name nodes?
  - How does kaspad use them (code path, at a named commit)?
- **Peer discovery.** Trace the mechanics through the address manager, the connection manager, address gossip, and inbound and outbound limits. How long does a new node take to find peers, and what decides which ones it keeps? Cite the code.
- **Resolver.** How does the kaspa wasm resolver choose endpoints for testnet-10, and why does it only return a few? Cite the source.
- **Versions.** What mix of node versions is on the network (2.1.0, 2.0.x, older), and does it affect peering, for example P2P protocol 11 and chunked IBD?
- **Anything else relevant.** Include the gap between the dashboard's 43 and what anyone can actually send to.

## Rules

- **Read-only and polite.** Keep to light reads: RPC info calls, your own nodes' peer lists, and public pages. No load and no sends through other people's nodes. Don't run wide port scans of third parties beyond what's needed to confirm a count.
- **Nothing private in public.** No IPs (not even partial), node ids, ports, keys, addresses or txids in anything public. Hostnames of public services are fine. Keep raw data private.
- **Humble tone.** "We observed", corrections welcome, no claims about Kaspa in general.
- **Our own nodes.** The desk and Mini are ours. TN10 ops has full authority over them. Ask TN10 ops for anything you need from them, such as the Mini's command line or peer lists. Do not stop or restart desk kaspad.
- **Post back here.** Put your findings in `findings/NODE-DEEP-DIVE.md` in this repo, each item sourced, plus a short summary comment on issue #1. Then post `READY-NODE-DEEP-DIVE.md` with a commit titled "READY-NODE-DEEP-DIVE". TN10 ops reviews them and carries the verified parts to tn-master.
