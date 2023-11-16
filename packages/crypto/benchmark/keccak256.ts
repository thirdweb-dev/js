import { Bench } from "tinybench";
import { keccak256SyncHex } from "../src";
import { utils } from "ethers";
import {
  uint8ArrayToString,
  uint8ArrayToHex,
} from "../src/utils/uint8array-extras";
import { keccak_256 as noble } from "@noble/hashes/sha3";
import { keccak256 as viem } from "viem";
// @ts-expect-error - this function actually does exist
import { consoleTable } from "js-awe";

const value = crypto.getRandomValues(new Uint8Array(1000));
const stringValue = uint8ArrayToString(value);

const uint8Bench = new Bench({ iterations: 100_000 });

uint8Bench
  .add("@thirdweb-dev/crypto", async () => {
    keccak256SyncHex(value);
  })
  .add("ethers@v5", async () => {
    utils.keccak256(value);
  })
  .add("@noble/hashes", async () => {
    uint8ArrayToHex(noble(value));
  })
  .add("viem", async () => {
    viem(value);
  });

await uint8Bench.warmup();
await uint8Bench.run();

console.log();
console.log("keccak256(<Uint8Array>):");
consoleTable(uint8Bench.table());
console.log();

const stringBench = new Bench({ iterations: 100_000 });

stringBench
  .add("@thirdweb-dev/crypto", async () => {
    keccak256SyncHex(stringValue);
  })
  .add("ethers@5", async () => {
    // OK because this is benchmark code only
    // eslint-disable-next-line no-restricted-globals
    utils.keccak256(Buffer.from(stringValue));
  })
  .add("@noble/hashes", async () => {
    uint8ArrayToHex(noble(stringValue));
  })
  .add("viem", async () => {
    viem(stringValue as `0x${string}`);
  });

await stringBench.warmup();
await stringBench.run();

console.log("keccak256(<string>):");
consoleTable(stringBench.table());
console.log();
