// keygen.mjs — creates the runner's two dedicated TN10 keys (guest operator for ttflow carriers, guest issuer for ttd).
// They are fresh random keys, not keys 0, 1 or 2 of the pre-run kits. Written once, mode 600, never printed.
import fs from "node:fs"; import crypto from "node:crypto";
import { KEYFILE } from "./lib.mjs";
if (fs.existsSync(KEYFILE)) { console.log(JSON.stringify({ keygen: "exists", file_mode: (fs.statSync(KEYFILE).mode & 0o777).toString(8) })); process.exit(0); }
const body = JSON.stringify({ note: "TN10 tic-tac-toe guest runner keys. Testnet-10 only. Not kit keys 0/1/2.", created: new Date().toISOString(),
  operator: crypto.randomBytes(32).toString("hex"), issuer: crypto.randomBytes(32).toString("hex") });
fs.writeFileSync(KEYFILE, body, { mode: 0o600 }); fs.chmodSync(KEYFILE, 0o600);
console.log(JSON.stringify({ keygen: "created", file_mode: "600" }));
