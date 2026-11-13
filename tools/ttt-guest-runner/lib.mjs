// lib.mjs — tic-tac-toe guest carrier runner helpers. KASPA TESTNET-10 ONLY.
// Shapes follow vprogs app-kit (payload.rs, lane.rs) and vprog-tictactoe guest encoders (action/encode.rs).
// Nothing here submits. Keys and node addresses come from files under private/ (never committed).
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const HERE = path.dirname(new URL(import.meta.url).pathname);
export const SDK = process.env.KASPA_SDK || "/workspace/sdk210/kaspa-wasm32-sdk/nodejs/kaspa";
export const kaspa = require(SDK);
export const NET = "testnet-10";
export const PRIV = process.env.TTT_PRIVATE || path.join(HERE, "private");
export const KEYFILE = process.env.TTT_KEYFILE || "/home/box/secure/ttt-guest-keys.json";

// Action tags (vprog-tictactoe guest, program/action.rs ActionTag); only the length of each body matters for mass.
export const LOCK_SCHNORR_LEN = 1 + 32;               // LockEnum::encode: tag || x-only pubkey
export const ACCESS_ENTRY_LEN = 32 + 1;               // AccessMetadata: resource id || access type
export const SIGPTR_ENTRY_LEN = 1 + 1 + 4;            // encode_signer_entry SigPtr: resource_idx || tag || sig_offset(le32)
const le32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
const le64 = (n) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(n)); return b; };

// LanePayload layout: access_meta || signers_section || actions_section || tail (payload.rs presig()/finish()).
export function lanePayload({ access, actions, sigptr = 0 }) {
  const parts = [le32(access.length)];
  for (const a of access) parts.push(a.id, Buffer.from([a.type]));
  const accessLen = 4 + access.length * ACCESS_ENTRY_LEN;
  const presigLen = accessLen + 4 + sigptr * SIGPTR_ENTRY_LEN + 4 + actions.reduce((s, x) => s + x.length, 0);
  parts.push(le32(sigptr));
  for (let i = 0; i < sigptr; i++) parts.push(Buffer.from([0, 1]), le32(presigLen + 64 * i));
  parts.push(le32(actions.length), ...actions);
  const presig = Buffer.concat(parts);
  if (presig.length !== presigLen) throw new Error("layout length mismatch");
  // Sig64 tail: a real BIP-340 signature goes here at run time (over compute_sig_message(rest_preimage, presig)).
  // Offline we place 64 bytes of the right length; mass depends on length only.
  const tail = Buffer.alloc(64 * sigptr, 0x5a);
  return { bytes: Buffer.concat([presig, tail]), presigLen };
}
const rid = () => crypto.randomBytes(32);
const W = 1, R = 0; // AccessType byte values are placeholders: one byte either way.
const lock = (pub) => Buffer.concat([Buffer.from([0]), pub]); // lock tag byte: value is a placeholder, length (1) is exact
// The three carrier shapes a single match starts with.
export function shapes(pub, covenantId) {
  return {
    init: lanePayload({ access: [{ id: rid(), type: W }], sigptr: 1,
      actions: [Buffer.concat([Buffer.from([2, 0]), le64(1_000_000), le64(10_000), covenantId, lock(pub)])] }),
    deposit: lanePayload({ access: [{ id: rid(), type: W }, { id: rid(), type: R }], sigptr: 0,
      actions: [Buffer.concat([Buffer.from([5, 0, 1]), le32(0), lock(pub)])] }),
    turn: lanePayload({ access: [{ id: rid(), type: W }, { id: rid(), type: W }], sigptr: 1,
      actions: [Buffer.from([9, 0, 1, 4])] }),
  };
}
// KIP-21 user-lane subnetwork id: [lane_id big-endian (4 bytes), 16 zero bytes].
export const laneSubnet = (laneId) => { const b = Buffer.alloc(20); b.writeUInt32BE(laneId >>> 0); return b.toString("hex"); };

export function loadKeys() {
  const j = JSON.parse(fs.readFileSync(KEYFILE, "utf8"));
  const mk = (h) => { const k = new kaspa.PrivateKey(h); const kp = k.toKeypair(); return { key: k, addr: kp.toAddress(NET).toString(), xonly: Buffer.from(kp.xOnlyPublicKey, "hex") }; };
  return { operator: mk(j.operator), issuer: mk(j.issuer) };
}
export const tkas = (s) => Number(s) / 1e8;
