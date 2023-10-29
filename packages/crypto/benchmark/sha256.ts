import Benchmark from "benchmark";
import { sha256, sha256Hex, sha256Sync, sha256HexSync } from "../src";
import { SHA256, enc } from "crypto-js";
import { uint8ArrayToString } from "uint8array-extras";

const STRING_TO_HASH = uint8ArrayToString(
  crypto.getRandomValues(new Uint8Array(1000)),
);

const suite = new Benchmark.Suite();

suite
  .add("sha256", async () => {
    await sha256(STRING_TO_HASH);
  })
  .add("sha256 -> hex", async () => {
    await sha256Hex(STRING_TO_HASH);
  })
  .add("sha256Sync", async () => {
    sha256Sync(STRING_TO_HASH);
  })
  .add("sha256Sync -> hex", async () => {
    sha256HexSync(STRING_TO_HASH);
  })
  .add("crypto-js: sha256", async () => {
    SHA256(STRING_TO_HASH).toString();
  })
  .add("crypto-js: sha256 -> hex", async () => {
    SHA256(STRING_TO_HASH).toString(enc.Hex);
  });

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name") + "\n");
  })
  .run({ async: true });
