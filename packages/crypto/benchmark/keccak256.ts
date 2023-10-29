import Benchmark from "benchmark";
import { keccak256SyncHex } from "../src";
import { utils } from "ethers";
import { uint8ArrayToString, uint8ArrayToHex } from "uint8array-extras";
import { keccak_256 } from "@noble/hashes/sha3";

const value = crypto.getRandomValues(new Uint8Array(1000));
const stringValue = uint8ArrayToString(value);

const suite = new Benchmark.Suite();

suite
  .add("keccak256SyncHex", async () => {
    keccak256SyncHex(value);
  })
  .add("string -> keccak256SyncHex", async () => {
    keccak256SyncHex(stringValue);
  })
  .add("ethers: keccak256", async () => {
    utils.keccak256(value);
  })
  .add("string -> ethers: keccak256", async () => {
    utils.keccak256(Buffer.from(stringValue));
  })
  .add("@noble/hashes: keccak_256", async () => {
    uint8ArrayToHex(keccak_256(value));
  })
  .add("string -> @noble/hashes: keccak_256", async () => {
    uint8ArrayToHex(keccak_256(stringValue));
  });

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name") + "\n");
  })
  .run({ async: true });
