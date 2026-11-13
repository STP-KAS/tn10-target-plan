// offline-check.mjs — builds and signs the three carrier shapes of one match start (Init, Deposit, Turn) with the
// runner's own guest operator key over a made-up funding outpoint, then checks mass, fee and scripts. NO NETWORK.
// Output: JSON lines to stdout and logs/offline-check.jsonl. No key, address, txid or covenant id is printed.
import fs from "node:fs"; import crypto from "node:crypto";
import { kaspa, NET, shapes, laneSubnet, loadKeys, HERE } from "./lib.mjs";
const FLOOR = 100n;                       // node-mass floor rate used in pre-runs 14-24 (sompi per gram)
const MAXSTD = BigInt(kaspa.maximumStandardTransactionMass());
const FUND = BigInt(process.env.TTT_FUND_SOMPI || 25_00000000);   // one large funding coin (plan: few large coins)
const DEPOSIT = BigInt(process.env.TTFLOW_DEPOSIT_AMOUNT || 1_00000000); // ttflow default deposit 1 tKAS
const out = []; const log = (o) => { out.push(o); console.log(JSON.stringify(o)); };
const { operator } = loadKeys();
const lane = crypto.randomBytes(4).readUInt32BE(0) || 1;
const covenantId = crypto.randomBytes(32);                     // made up: offline only
const S = shapes(operator.xonly, covenantId);
const opSpk = kaspa.payToAddressScript(operator.addr);
const depSpk = kaspa.payToScriptHashScript("00".repeat(40));   // P2SH shape of the covenant deposit output (35-byte spk)
const entry = { address: operator.addr, outpoint: { transactionId: crypto.randomBytes(32).toString("hex"), index: 0 },
  utxoEntry: { amount: FUND, scriptPublicKey: opSpk, blockDaaScore: 0n, isCoinbase: false } };

function build(name, payload, extra) {
  // Same composition as vprogs signed_carrier_transaction: one funding input, extra outputs first, change last,
  // TX_VERSION_TOCCATA (1), user-lane subnetwork. Fee at the floor rate on the node mass, iterated (change moves storage mass).
  let fee = 0n, tx, mass = 0n;
  for (let i = 0; i < 4; i++) {
    const change = FUND - extra.reduce((s, o) => s + o.amount, 0n) - fee;
    tx = kaspa.createTransaction([entry], [...extra.map((o) => ({ address: o.address, amount: o.amount })), { address: operator.addr, amount: change }], 0n, payload.toString("hex"), 1);
    tx.version = 1; tx.subnetworkId = laneSubnet(lane);
    kaspa.signTransaction(tx, [operator.key], true);        // verify_sig = true: the SDK checks the signature it made
    mass = BigInt(kaspa.calculateTransactionMass(NET, tx));
    const need = mass * FLOOR; if (need <= fee) break; fee = need;
  }
  const outsV = tx.outputs.map((o) => o.value);
  const storage = kaspa.calculateStorageMass(NET, [Number(FUND)], outsV.map(Number));
  const ss = tx.inputs[0].signatureScript.replace(/^0x/, "");
  const checks = {
    version_1: tx.version === 1,
    lane_subnet_kip21: tx.subnetworkId.slice(8) === "0".repeat(32) && tx.subnetworkId.slice(0, 8) !== "00000000",
    sig_script_schnorr_push65_sighash_all: ss.length === 132 && ss.startsWith("41") && ss.endsWith("01"),
    input_spk_is_operator_p2pk: opSpk.script.length === 68 && opSpk.script.startsWith("20") && opSpk.script.endsWith("ac"),
    deposit_output_p2sh: extra.length === 0 || (tx.outputs[0].scriptPublicKey.script.length === 70 && tx.outputs[0].scriptPublicKey.script.startsWith("aa20")),
    payload_len_matches_layout: tx.payload.replace(/^0x/, "").length / 2 === payload.length,
    under_standard_mass: mass <= MAXSTD,
    fee_pays_floor: FUND - outsV.reduce((s, v) => s + BigInt(v), 0n) >= mass * FLOOR,
    values_balance: outsV.reduce((s, v) => s + BigInt(v), 0n) + fee === FUND,
  };
  log({ ev: "carrier", name, payload_bytes: payload.length, mass: Number(mass), storage_mass: Number(storage ?? -1n), max_standard_mass: Number(MAXSTD),
    fee_sompi_at_floor: Number(fee), fee_tkas_at_floor: Number(fee) / 1e8, deposit_tkas: extra.length ? Number(DEPOSIT) / 1e8 : 0,
    checks, all_ok: Object.values(checks).every(Boolean) });
  return Object.values(checks).every(Boolean);
}
log({ ev: "start", t: new Date().toISOString(), net: NET, sdk: kaspa.version(), network_contact: "none", floor_sompi_per_gram: Number(FLOOR), fund_tkas: Number(FUND) / 1e8 });
const depAddr = kaspa.addressFromScriptPublicKey(depSpk, NET).toString();
const ok = [build("init", S.init.bytes, []), build("deposit", S.deposit.bytes, [{ address: depAddr, amount: DEPOSIT }]), build("turn", S.turn.bytes, [])].every(Boolean);
log({ ev: "done", all_ok: ok, submitted: 0 });
fs.mkdirSync(HERE + "/logs", { recursive: true });
fs.writeFileSync(HERE + "/logs/offline-check.jsonl", out.map((o) => JSON.stringify(o)).join("\n") + "\n");
process.exit(ok ? 0 : 1);
