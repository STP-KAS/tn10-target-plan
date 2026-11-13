// readonly-check.mjs — read-only look at one TN10 node: network id, sync, version, fee estimate, and the two guest keys'
// coins. It never calls submitTransaction. The node URL is read from private/read-node.json and is not printed.
import fs from "node:fs"; import { createRequire } from "node:module";
import { kaspa, NET, PRIV, loadKeys } from "./lib.mjs";
const require = createRequire(import.meta.url);
if (!globalThis.WebSocket) globalThis.WebSocket = require("/workspace/prerun24-bot/node_modules/websocket").w3cwebsocket;
const url = process.env.TTT_READ_URL || JSON.parse(fs.readFileSync(PRIV + "/read-node.json", "utf8")).read_url;
const to = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);
const rpc = new kaspa.RpcClient({ url, encoding: kaspa.Encoding.Borsh, networkId: NET });
await to(rpc.connect({ timeoutDuration: 10000, blockAsyncConnect: true }), 15000);
const si = await to(rpc.getServerInfo(), 8000);
if (si.networkId !== "testnet-10") { console.log(JSON.stringify({ abort: "not testnet-10" })); process.exit(2); }
const a = await to(rpc.getBlockDagInfo(), 8000); await new Promise((r) => setTimeout(r, 10000)); const b = await to(rpc.getBlockDagInfo(), 8000);
const fe = (await to(rpc.getFeeEstimate({}), 8000)).estimate;
const k = loadKeys(); const coins = async (addr) => { const e = (await to(rpc.getUtxosByAddresses([addr]), 30000)).entries || []; return { coins: e.length, tkas: e.reduce((s, x) => s + Number(x.amount), 0) / 1e8 }; };
console.log(JSON.stringify({ t: new Date().toISOString(), read_only: true, submitted: 0, network: si.networkId, synced: si.isSynced, server_version: si.serverVersion,
  utxo_index: si.hasUtxoIndex, daa_moved_10s: Number(BigInt(b.virtualDaaScore) - BigInt(a.virtualDaaScore)),
  fee_estimate_sompi_per_gram: { priority: fe.priorityBucket.feerate, normal: fe.normalBuckets[0]?.feerate, low: fe.lowBuckets[0]?.feerate },
  guest_operator: await coins(k.operator.addr), guest_issuer: await coins(k.issuer.addr) }));
await rpc.disconnect(); process.exit(0);
