// mini-counter.mjs — TN10 only. Read-only on this machine's own node.
// A Windows scheduled task runs it every 5 minutes. While a run is live it
// samples that node and writes totals to counts/MINI.md in the run repo, then
// pushes that one file from this machine's clone. At close it writes one row
// marked FINAL and goes idle. It submits nothing and publishes no id, host,
// port, key, address, or covenant id.
//
// A run is live when the clone has RUN-ACTIVE, or when tn10-target-plan's
// runs table has a row whose status is in-progress.
//
// Usage:
//   node mini-counter.mjs                  one pass (what the task runs)
//   node mini-counter.mjs --self-test <repo>   one read of a past repo, no write, no push
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const HOME = process.env.USERPROFILE || "";
const STATE_DIR = path.join(HOME, "tn10-mini-counter-state");
const STATE_FILE = path.join(STATE_DIR, "state.json");
const LOG_FILE = path.join(STATE_DIR, "counter.log");
const ROLE_FILE = path.join(STATE_DIR, "role.txt");
const PLAN_RAW = "https://raw.githubusercontent.com/STP-KAS/tn10-target-plan/main/runs/README.md";
const argv = process.argv.slice(2);
const selfTest = argv.includes("--self-test");
const selfRepo = selfTest ? argv[argv.indexOf("--self-test") + 1] : "";
const MAX_MS = selfTest ? 90000 : 200000;

function iso(ms = Date.now()) {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function clean(s) {
  return String(s)
    .replace(/wss?:\/\/\S+/g, "<url>")
    .replace(/https?:\/\/\S+/g, "<url>")
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "<ip>")
    .replace(/[0-9a-f]{64}/gi, "<h>")
    .replace(/kaspatest:[a-z0-9]+/gi, "<addr>")
    .replace(/C:\\Users\\[^\\]+/gi, "C:\\Users\\Fermi")
    .slice(0, 240);
}
function log(line) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, iso() + " " + clean(line) + "\n");
}
function shaOfId(hex) {
  const raw = String(hex).replace(/^0x/i, "").toLowerCase();
  return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
}
function norm(h) {
  return String(h || "").replace(/^0x/, "").toLowerCase();
}

function resolveGit() {
  const known = path.join(HOME, "AppData", "Local", "grok", "git", "2.55.0.windows.5", "cmd", "git.exe");
  if (fs.existsSync(known)) return known;
  const r = spawnSync("where.exe", ["git"], { encoding: "utf8" });
  const line = (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
  if (!line) throw new Error("git not found");
  return line;
}

function sdkPath() {
  const candidates = [
    path.join(HOME, "tn10-storm-kit", "sdk", "kaspa", "kaspa.js"),
    path.join(HOME, "src", "tn10-storm-kit", "sdk", "kaspa", "kaspa.js"),
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error("kaspa sdk not found under the profile");
}

function nodeUrl() {
  if (process.env.TN10_NODE_URL) return process.env.TN10_NODE_URL.trim();
  const own = path.join(STATE_DIR, "node-url.txt");
  if (fs.existsSync(own)) return fs.readFileSync(own, "utf8").trim();
  const hit = findFile(HOME, "node-url.txt", 3);
  if (hit) return fs.readFileSync(hit, "utf8").trim();
  throw new Error("node url file missing");
}

function findFile(dir, name, depth) {
  if (depth < 0 || !dir || !fs.existsSync(dir)) return "";
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return ""; }
  for (const e of entries) {
    if (e.name === name && e.isFile()) return path.join(dir, e.name);
  }
  for (const e of entries) {
    if (!e.isDirectory() || e.name === "node_modules" || e.name.startsWith(".")) continue;
    const hit = findFile(path.join(dir, e.name), name, depth - 1);
    if (hit) return hit;
  }
  return "";
}

function repoCandidates() {
  const roots = [path.join(HOME, "src"), HOME];
  const out = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    let entries = [];
    try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (/^tn10-storm-2026-11-11-prerun/.test(e.name)) out.push(path.join(root, e.name));
    }
  }
  return out;
}

function runActive(repo) {
  return fs.existsSync(path.join(repo, "RUN-ACTIVE"));
}

async function liveFromPlan() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(PLAN_RAW, { signal: ctrl.signal });
    if (!res.ok) return null;
    const text = await res.text();
    for (const line of text.split(/\r?\n/)) {
      if (!line.startsWith("|")) continue;
      if (!/\bin-progress\b/.test(line)) continue;
      const m = line.match(/tn10-storm-2026-11-11-prerun[a-z0-9-]*/);
      if (!m) continue;
      return m[0];
    }
    return null;
  } catch (e) {
    log("plan read failed " + (e?.message || e));
    return null;
  } finally {
    clearTimeout(t);
  }
}

function ensureClone(name) {
  for (const repo of repoCandidates()) if (path.basename(repo) === name) return repo;
  const dest = path.join(HOME, "src", name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const git = resolveGit();
  const r = spawnSync(git, ["clone", "--depth", "1", `https://github.com/STP-KAS/${name}.git`, dest], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("clone failed " + clean(r.stderr || r.stdout || ""));
  return dest;
}

async function findLive() {
  if (selfTest) {
    if (!selfRepo || !fs.existsSync(selfRepo)) throw new Error("self-test repo missing");
    return { repo: path.resolve(selfRepo), why: "self-test" };
  }
  const active = repoCandidates().filter(runActive);
  if (active.length) {
    active.sort((a, b) => fs.statSync(path.join(b, "RUN-ACTIVE")).mtimeMs - fs.statSync(path.join(a, "RUN-ACTIVE")).mtimeMs);
    return { repo: active[0], why: "RUN-ACTIVE" };
  }
  const name = await liveFromPlan();
  if (!name) return null;
  return { repo: ensureClone(name), why: "runs-row" };
}

function loadFamilies(repo) {
  const file = path.join(repo, "hashes", "SIXTEEN.md");
  if (!fs.existsSync(file)) return [];
  const families = [];
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\|\s*(\d+)\s*\|\s*([a-z0-9-]+)\s*\|\s*`([0-9a-f]{64})`/i);
    if (!m) continue;
    families.push({ n: Number(m[1]), cohort: m[2].toLowerCase(), hash: m[3].toLowerCase() });
  }
  return families;
}

function windowOf(repo) {
  const openFile = path.join(repo, "logs", "PRE-RUN-OPEN.md");
  let openMs = 0;
  if (fs.existsSync(openFile)) {
    const m = fs.readFileSync(openFile, "utf8").match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
    if (m) openMs = Date.parse(m[1]);
  }
  let endMs = 0;
  const failed = fs.existsSync(path.join(repo, "logs", "FAILED.md"));
  const readme = path.join(repo, "README.md");
  if (!runActive(repo) && fs.existsSync(readme)) {
    const m = fs.readFileSync(readme, "utf8").match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/g);
    if (m && m.length) endMs = Date.parse(m[m.length - 1]);
  }
  return { openMs, endMs, failed };
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch { return null; }
}
function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const tmp = STATE_FILE + ".tmp";
  const covOut = [...(state.covOut || [])].slice(-120000);
  const seenTx = [...(state.seenTx || [])].slice(-100000);
  const keys = Object.keys(state.byBlock || {});
  const byBlock = {};
  for (const k of keys.slice(-8000)) byBlock[k] = state.byBlock[k];
  const copy = { ...state, covOut, seenTx, byBlock };
  delete copy.seen;
  fs.writeFileSync(tmp, JSON.stringify(copy));
  fs.renameSync(tmp, STATE_FILE);
}

function blankState(repo) {
  const w = windowOf(repo);
  return {
    repo,
    openMs: w.openMs,
    sink: "",
    hops: 0,
    mints: 0,
    carriers: null,
    payloadSeen: false,
    partial: true,
    caughtUp: false,
    final: false,
    samples: [],
    covOut: [],
    seenTx: [],
    byBlock: {},
    missingMeta: 0,
    why: "",
  };
}

async function withNode(fn) {
  const require = createRequire(import.meta.url);
  const k = require(sdkPath());
  const url = nodeUrl();
  if (!/^wss?:\/\//.test(url)) throw new Error("node url scheme refused");
  const c = new k.RpcClient({ url, encoding: k.Encoding.Borsh, networkId: "testnet-10" });
  await c.connect({ timeoutDuration: 8000, retryInterval: 0 });
  try {
    const info = await c.getServerInfo();
    if (String(info.networkId) !== "testnet-10") throw new Error("refusing node, not testnet-10");
    return await fn(c, info);
  } finally {
    try { await c.disconnect(); } catch {}
  }
}

function headerMs(block) {
  const ts = Number(block?.header?.timestamp || 0);
  return ts < 1e12 ? ts * 1000 : ts;
}

function txId(tx) {
  return norm(tx?.verboseData?.transactionId || tx?.verboseData?.transaction_id || tx?.id || "");
}

function rememberTx(metaMap, covOut, tx) {
  const id = txId(tx);
  if (!id || metaMap.has(id)) return;
  const inputs = [];
  for (const inp of tx.inputs || []) {
    const op = inp.previousOutpoint || inp.previous_outpoint;
    if (!op) continue;
    const tid = norm(op.transactionId || op.transaction_id);
    const ix = op.index ?? op.outputIndex ?? 0;
    if (tid) inputs.push(tid + ":" + ix);
  }
  const outputs = [];
  (tx.outputs || []).forEach((o, ix) => {
    const raw = o.covenant && (o.covenant.covenantId || o.covenant.covenant_id);
    if (!raw) return;
    outputs.push({ ix, cov: String(raw).replace(/^0x/i, "").toLowerCase() });
    covOut.add(id + ":" + ix);
  });
  const payload = String(tx.payload ?? "").replace(/^0x/i, "");
  const sub = String(tx.subnetworkId || tx.subnetwork_id || "").replace(/^0x/i, "").toLowerCase();
  metaMap.set(id, {
    inputs,
    outputs,
    coinbase: !(tx.inputs || []).length,
    payload,
    sub,
    payloadField: Object.prototype.hasOwnProperty.call(tx, "payload") || tx.payload != null,
  });
}

function isCarrierMeta(meta) {
  if (!meta || meta.coinbase || meta.outputs.length) return false;
  const hex = meta.payload;
  if (!hex || hex.length < 8 || hex.length % 2) return false;
  let access = 0;
  try { access = Buffer.from(hex.slice(0, 8), "hex").readUInt32LE(0); } catch { return false; }
  if (access < 1 || access > 8) return false;
  const sub = meta.sub;
  return sub.length === 40 && sub.slice(8) === "0".repeat(32) && sub.slice(0, 8) !== "00000000";
}

function kindOf(meta, covOut, byHash) {
  if (!meta || meta.coinbase) return "";
  const spent = meta.inputs.some((key) => covOut.has(key));
  let matched = null;
  for (const o of meta.outputs) {
    const fam = byHash.get(shaOfId(o.cov));
    if (fam) matched = fam;
  }
  if (matched && spent) return (matched.cohort === "kcc" || matched.cohort.includes("mint")) ? "mint" : "hop";
  if (!matched && isCarrierMeta(meta)) return "carrier";
  return "";
}

function addCount(state, kind) {
  if (kind === "hop") state.hops += 1;
  else if (kind === "mint") state.mints += 1;
  else if (kind === "carrier") state.carriers = (state.carriers || 0) + 1;
}

function subCount(state, kind) {
  if (kind === "hop") state.hops = Math.max(0, (state.hops || 0) - 1);
  else if (kind === "mint") state.mints = Math.max(0, (state.mints || 0) - 1);
  else if (kind === "carrier") state.carriers = Math.max(0, (state.carriers || 0) - 1);
}

function uncount(state, byBlock, seenTx, blockHash) {
  const rows = byBlock[blockHash] || [];
  for (const [id, kind] of rows) {
    subCount(state, kind);
    seenTx.delete(id);
  }
  delete byBlock[blockHash];
}

async function seekNearOpen(c, state, deadline) {
  const target = state.openMs - 30000;
  while (Date.now() < deadline) {
    const v = await c.getVirtualChainFromBlock({ startHash: state.sink, includeAcceptedTransactionIds: false });
    const added = (v.addedChainBlockHashes || v.added_chain_block_hashes || []).map(norm);
    if (!added.length) { state.sought = true; return; }
    const last = added[added.length - 1];
    if (last === state.sink) { state.sought = true; return; }
    const lastBlock = await c.getBlock({ hash: last, includeTransactions: false });
    if (headerMs(lastBlock.block) < target) {
      state.sink = last;
      continue;
    }
    let lo = 0;
    let hi = added.length - 1;
    let best = state.sink;
    while (lo <= hi && Date.now() < deadline) {
      const mid = (lo + hi) >> 1;
      const b = await c.getBlock({ hash: added[mid], includeTransactions: false });
      if (headerMs(b.block) < target) { best = added[mid]; lo = mid + 1; }
      else hi = mid - 1;
    }
    state.sink = best;
    state.sought = true;
    return;
  }
}

function finishScan(state, covOut, seenTx, byBlock, payloadSeen) {
  state.covOut = [...covOut];
  state.seenTx = [...seenTx];
  state.byBlock = byBlock;
  state.payloadSeen = payloadSeen;
  if (!payloadSeen) state.carriers = null;
  if (state.unreadWindow) {
    state.partial = false;
    state.caughtUp = true;
    return;
  }
  state.partial = !(state.caughtUp && !state.missingMeta);
}

async function scan(c, state, families) {
  const deadline = Date.now() + MAX_MS;
  const byHash = new Map(families.map((f) => [f.hash, f]));
  const covOut = new Set(state.covOut || []);
  const seenTx = new Set(state.seenTx || []);
  const byBlock = state.byBlock || {};
  state.missingMeta = state.missingMeta || 0;
  let payloadSeen = !!state.payloadSeen;
  const dag = await c.getBlockDagInfo();
  if (!state.openMs) {
    state.unreadWindow = true;
    finishScan(state, covOut, seenTx, byBlock, payloadSeen);
    return;
  }
  if (!state.sink) {
    const prune = norm(dag.pruningPointHash || dag.pruning_point_hash || "");
    let pruneMs = 0;
    if (prune) {
      try {
        const b = await c.getBlock({ hash: prune, includeTransactions: false });
        pruneMs = headerMs(b.block);
      } catch { pruneMs = 0; }
    }
    if (pruneMs && pruneMs > state.openMs + 60000) {
      state.unreadWindow = true;
      state.sink = "";
      finishScan(state, covOut, seenTx, byBlock, payloadSeen);
      return;
    }
    state.sink = prune || norm(dag.sink || dag.sinkHash);
    state.caughtUp = false;
    state.partial = true;
  }
  if (!state.sought && state.sink) await seekNearOpen(c, state, deadline);
  while (Date.now() < deadline) {
    const info = await c.getBlockDagInfo();
    const sinkNow = norm(info.sink || info.sinkHash);
    let resp;
    try {
      resp = await c.getBlocks({ lowHash: state.sink, includeBlocks: true, includeTransactions: true });
    } catch (e) {
      log("blocks unread " + clean(e?.message || e));
      state.caughtUp = false;
      break;
    }
    const hashes = (resp.blockHashes || resp.block_hashes || []).map(norm);
    const blocks = resp.blocks || [];
    if (!hashes.length) { state.caughtUp = state.sink === sinkNow; break; }
    const metaMap = new Map();
    const timeOf = new Map();
    hashes.forEach((h, i) => { if (blocks[i]) timeOf.set(h, headerMs(blocks[i])); });
    for (const block of blocks) {
      for (const tx of block.transactions || []) {
        rememberTx(metaMap, covOut, tx);
        if (Object.prototype.hasOwnProperty.call(tx, "payload") || tx.payload != null) payloadSeen = true;
      }
    }
    const reached = hashes.includes(sinkNow);
    const next = reached ? sinkNow : hashes[hashes.length - 1];
    if (!next || next === state.sink) {
      state.caughtUp = state.sink === sinkNow;
      break;
    }
    let chain;
    try {
      chain = await c.getVirtualChainFromBlock({ startHash: state.sink, includeAcceptedTransactionIds: true });
    } catch (e) {
      log("chain cursor off " + clean(e?.message || e));
      state.partial = true;
      state.caughtUp = false;
      if (reached) state.sink = sinkNow;
      break;
    }
    const removed = (chain.removedChainBlockHashes || chain.removed_chain_block_hashes || []).map(norm);
    for (const h of removed) uncount(state, byBlock, seenTx, h);
    const hashSet = new Set(hashes);
    const groups = chain.acceptedTransactionIds || chain.accepted_transaction_ids || [];
    for (const g of groups) {
      const block = norm(g.acceptingBlockHash || g.accepting_block_hash);
      if (!block || block === state.sink || !hashSet.has(block)) continue;
      const ms = timeOf.get(block) || 0;
      if (state.openMs && ms && ms < state.openMs - 1000) continue;
      const ids = (g.acceptedTransactionIds || g.accepted_transaction_ids || []).map(norm);
      for (const id of ids) {
        if (!id || seenTx.has(id)) continue;
        const meta = metaMap.get(id);
        if (!meta) { state.missingMeta += 1; continue; }
        const kind = kindOf(meta, covOut, byHash);
        if (!kind) continue;
        addCount(state, kind);
        seenTx.add(id);
        if (!byBlock[block]) byBlock[block] = [];
        byBlock[block].push([id, kind]);
      }
    }
    state.sink = next;
    if (reached) { state.caughtUp = true; break; }
    if (Date.now() >= deadline) { state.caughtUp = false; break; }
  }
  finishScan(state, covOut, seenTx, byBlock, payloadSeen);
}

function render(state, daa, mempool) {
  const lines = [
    "> **Experimental. We are just trying this.** Testnet-10 only. tKAS has no value.",
    "",
    "# Mini count",
    "",
    "Totals from this node's own read. One row each time the counter woke. Not Pulse's count. No per-transaction list.",
    "",
    "| UTC | DAA | Mempool | Hops | Mints | Carriers | Mark |",
    "|---|---:|---:|---:|---:|---:|---|",
  ];
  for (const row of state.samples) {
    const carriers = row.carriers == null ? "unread" : String(row.carriers);
    lines.push(`| ${row.t} | ${row.daa} | ${row.mempool} | ${row.hops} | ${row.mints} | ${carriers} | ${row.mark} |`);
  }
  if (state.unreadWindow) lines.push("", "The window's blocks were already past this node's pruning point, so hops, mints and carriers stay unread. DAA and mempool are this wake's sample.");
  else if (!state.caughtUp) lines.push("", "This read is still catching up to the tip. A later row replaces these totals when the catch-up finishes.");
  else if (state.missingMeta) lines.push("", "Some accepted transactions had no body on this node. Hops, mints and carriers are a lower bound from the bodies that were read.");
  lines.push("");
  return lines.join("\n");
}

function publish(repo, body) {
  const dir = path.join(repo, "counts");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "MINI.md");
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (prev === body) return false;
  fs.writeFileSync(file, body);
  return true;
}

function push(repo) {
  const role = (fs.existsSync(ROLE_FILE) ? fs.readFileSync(ROLE_FILE, "utf8") : process.env.TN10_ROLE || "").trim();
  if (role !== "mini") {
    log("push skipped, role is not mini");
    return;
  }
  const git = resolveGit();
  const opt = { cwd: repo, encoding: "utf8" };
  spawnSync(git, ["add", "--", "counts/MINI.md"], opt);
  const st = spawnSync(git, ["diff", "--cached", "--name-only"], opt);
  if (!String(st.stdout || "").includes("counts/MINI.md")) return;
  const msg = "Mini counter: totals from this node's read";
  const c = spawnSync(git, ["commit", "-m", msg], opt);
  if (c.status !== 0) {
    log("commit failed " + clean(c.stderr || c.stdout || ""));
    return;
  }
  const p = spawnSync(git, ["push"], opt);
  if (p.status !== 0) log("push failed " + clean(p.stderr || p.stdout || ""));
  else log("pushed counts/MINI.md");
}

function closed(repo, state) {
  if (selfTest) return false;
  if (runActive(repo)) return false;
  if (state.why === "runs-row") return false;
  const w = windowOf(repo);
  if (w.failed) return true;
  const ret = path.join(repo, "counts", "desk", "RETURN.md");
  return fs.existsSync(ret);
}

async function main() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const live = await findLive();
  let state = loadState();
  if (!live) {
    if (state && state.repo && !state.final && fs.existsSync(state.repo)) {
      const why = state.why || "";
      const done = why === "runs-row" || fs.existsSync(path.join(state.repo, "logs", "FAILED.md")) || fs.existsSync(path.join(state.repo, "counts", "desk", "RETURN.md"));
      if (!done) {
        log("idle");
        return;
      }
      state.final = true;
      state.samples.push({
        t: iso(),
        daa: state.lastDaa ?? "unread",
        mempool: state.lastMempool ?? "unread",
        hops: state.unreadWindow ? "unread" : state.hops,
        mints: state.unreadWindow ? "unread" : state.mints,
        carriers: state.unreadWindow ? null : state.carriers,
        mark: "FINAL",
      });
      const body = render(state, state.lastDaa, state.lastMempool);
      if (!selfTest && publish(state.repo, body)) push(state.repo);
      saveState(state);
      log("FINAL " + path.basename(state.repo));
    } else {
      log("idle");
    }
    return;
  }
  if (!state || state.repo !== live.repo || state.final) state = blankState(live.repo);
  state.why = live.why;
  const families = loadFamilies(live.repo);
  const sample = await withNode(async (c, info) => {
    const daa = Number(info.virtualDaaScore ?? info.virtual_daa_score);
    const mem = await c.getMempoolEntries({ includeOrphanPool: false, filterTransactionPool: false });
    const mempool = (mem.mempoolEntries || mem.mempool_entries || []).length;
    if (families.length && !state.unreadWindow) await scan(c, state, families);
    return { daa, mempool };
  });
  state.lastDaa = sample.daa;
  state.lastMempool = sample.mempool;
  const mark = selfTest ? "SELF-TEST" : (state.unreadWindow || (state.caughtUp && !state.partial) ? "sample" : "partial");
  state.samples.push({
    t: iso(),
    daa: sample.daa,
    mempool: sample.mempool,
    hops: state.unreadWindow ? "unread" : state.hops,
    mints: state.unreadWindow ? "unread" : state.mints,
    carriers: state.unreadWindow ? null : state.carriers,
    mark,
  });
  const body = render(state, sample.daa, sample.mempool);
  if (selfTest) {
    const out = path.join(STATE_DIR, "self-test.md");
    fs.writeFileSync(out, body);
    log("self-test daa=" + sample.daa + " mempool=" + sample.mempool + " hops=" + state.hops + " mints=" + state.mints + " carriers=" + (state.carriers == null ? "unread" : state.carriers) + " families=" + families.length + " partial=" + (state.partial ? 1 : 0) + " unreadWindow=" + (state.unreadWindow ? 1 : 0) + " missing=" + (state.missingMeta || 0));
    console.log(JSON.stringify({
      daa: sample.daa,
      mempool: sample.mempool,
      hops: state.unreadWindow ? null : state.hops,
      mints: state.unreadWindow ? null : state.mints,
      carriers: state.unreadWindow ? null : state.carriers,
      families: families.length,
      partial: !!state.partial,
      unreadWindow: !!state.unreadWindow,
      payloadSeen: !!state.payloadSeen,
      missingMeta: state.missingMeta || 0,
      caughtUp: !!state.caughtUp,
      out: "tn10-mini-counter-state/self-test.md",
    }));
    return;
  }
  if (publish(live.repo, body)) push(live.repo);
  if (closed(live.repo, state)) {
    state.final = true;
    state.samples.push({
      t: iso(),
      daa: sample.daa,
      mempool: sample.mempool,
      hops: state.unreadWindow ? "unread" : state.hops,
      mints: state.unreadWindow ? "unread" : state.mints,
      carriers: state.unreadWindow ? null : state.carriers,
      mark: "FINAL",
    });
    const fin = render(state, sample.daa, sample.mempool);
    if (publish(live.repo, fin)) push(live.repo);
    log("FINAL " + path.basename(live.repo));
  }
  saveState(state);
  log("sample " + path.basename(live.repo) + " daa=" + sample.daa + " mempool=" + sample.mempool);
}

main().catch((e) => {
  log("fail " + (e?.message || e));
  console.error(clean(e?.stack || e?.message || e));
  process.exit(1);
});
