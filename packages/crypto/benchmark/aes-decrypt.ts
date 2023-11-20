import { Bench } from "tinybench";
import { aesDecrypt, aesDecryptCompat, aesEncrypt } from "../src";
import { AES, enc } from "crypto-js";
// @ts-expect-error - this function actually does exist
import { consoleTable } from "js-awe";

const PLAINTEXT = "my secret text";
const PASSWORD = "pw";

const encrypted = await aesEncrypt(PLAINTEXT, PASSWORD);
const encryptedCryptoJs = AES.encrypt(PLAINTEXT, PASSWORD).toString();

const bench = new Bench({ iterations: 100_000 });

bench
  .add("aesDecrypt", async () => {
    const res = await aesDecrypt(encrypted, PASSWORD);
    if (res !== PLAINTEXT) {
      throw new Error("aesDecrypt failed");
    }
  })
  .add("aesDecryptCompat", async () => {
    const res = await aesDecryptCompat(encrypted, PASSWORD);
    if (res !== PLAINTEXT) {
      throw new Error("aesDecryptCompat (compat, modern) failed");
    }
  })
  .add("aesDecryptCompat (crypto-js)", async () => {
    const res = await aesDecryptCompat(encryptedCryptoJs, PASSWORD);
    if (res !== PLAINTEXT) {
      throw new Error("aesDecryptCompat (compat, legacy) failed");
    }
  })
  .add("crypto-js", async () => {
    const res = AES.decrypt(encryptedCryptoJs, PASSWORD).toString(enc.Utf8);
    if (res !== PLAINTEXT) {
      throw new Error("crypto-js failed");
    }
  });

await bench.warmup();
await bench.run();

consoleTable(bench.table());
