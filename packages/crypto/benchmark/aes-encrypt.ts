import { Bench } from "tinybench";
import { aesEncrypt } from "../src";
import { AES } from "crypto-js";
// @ts-expect-error - this function actually does exist
import { consoleTable } from "js-awe";

const PLAINTEXT = "my secret text";
const PASSWORD = "pw";

const bench = new Bench({ iterations: 100_000 });

bench
  .add("aesEncrypt", async () => {
    await aesEncrypt(PLAINTEXT, PASSWORD);
  })
  .add("crypto-js", () => {
    AES.encrypt(PLAINTEXT, PASSWORD).toString();
  });

await bench.warmup();
await bench.run();

consoleTable(bench.table());
