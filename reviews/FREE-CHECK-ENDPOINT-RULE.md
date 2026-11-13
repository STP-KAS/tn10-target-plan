# Proposal: free-check endpoint rule

For TN10 ops to review. This file is not a review and not an approval. Nothing here arms a run, a send, or a HOLD-4. Testnet-10 only. Never mainnet.

Source of the counts: tn-master FINDINGS 80 at `4465ac9`, and the run files cited in [findings/PUBLIC-ENDPOINTS.md](../findings/PUBLIC-ENDPOINTS.md).

## Rule we propose

1. Count distinct node identities. A second DNS name that answers as a node already counted is not a second node.
2. Until ops publishes a verified list, the free check may dial only published sources: the list it already has, one pass of the public testnet-10 resolver, and the published name `tn10-node.kaspa.com`. Then it dedupes by identity.
3. Do not add an endpoint that showed up only in a peer address book or in a scan. FINDINGS 80 says those other wRPC nodes were found by scanning and are not published as public endpoints.
4. Our desk node and the Mini are not free public nodes.
5. A free node is a distinct synced public node that is not one of the two identities the check already keeps. If the distinct synced set is still those two, the file stays `NO SEND no-free-node`, as it has since pre-run 5.
6. `tn10-node.kaspa.com` is the one published name FINDINGS 80 set apart from those two. Ops verifies whether its identity is distinct and synced before it counts. This proposal does not say that it is, and it does not say to send there.
7. The public `NO SEND` file records the distinct count and the reason. It does not record hosts, IPs, ports, node ids, keys, addresses or txids.

On the FINDINGS 80 pass, step 2's resolver pass would not have added a distinct identity. Step 6 is the only published candidate beyond the two, and it stays unverified until ops says otherwise.

Plan section on the public compare is unchanged: aliases count once, a node ops has not verified is not a target, and the heavy lane does not go to a public node.
