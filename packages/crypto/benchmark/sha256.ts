import Bench from "tinybench";
import { sha256, sha256Hex, sha256Sync, sha256HexSync } from "../src";
import { SHA256, enc } from "crypto-js";
import { uint8ArrayToString } from "../src/utils/uint8array-extras";
// @ts-expect-error - this function actually does exist
import { consoleTable } from "js-awe";

const STRING_TO_HASH = uint8ArrayToString(
  crypto.getRandomValues(new Uint8Array(1000)),
);

const sha256Bench = new Bench({ iterations: 100_000 });

sha256Bench
  .add("@thirdweb-dev/crypto (async)", async () => {
    await sha256(STRING_TO_HASH);
  })
  .add("@thirdweb-dev/crypto (sync)", async () => {
    sha256Sync(STRING_TO_HASH);
  })
  .add("crypto-js (sync)", async () => {
    SHA256(STRING_TO_HASH).toString();
  });

await sha256Bench.warmup();
await sha256Bench.run();

console.log();
console.log("sha256:");
consoleTable(sha256Bench.table());
console.log();

const sha256HexBench = new Bench({ iterations: 100_000 });

sha256HexBench
  .add("@thirdweb-dev/crypto (async)", async () => {
    await sha256Hex(STRING_TO_HASH);
  })
  .add("@thirdweb-dev/crypto (sync)", async () => {
    sha256HexSync(STRING_TO_HASH);
  })
  .add("crypto-js (sync)", async () => {
    SHA256(STRING_TO_HASH).toString(enc.Hex);
  });

await sha256HexBench.warmup();
await sha256HexBench.run();

console.log("sha256 -> hex:");
consoleTable(sha256HexBench.table());
console.log();
