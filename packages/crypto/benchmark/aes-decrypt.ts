import Benchmark from "benchmark";
import { aesDecrypt, aesDecryptCompat, aesEncrypt } from "../src";
import { AES, enc } from "crypto-js";

const PLAINTEXT = "my secret text";
const PASSWORD = "pw";

const encrypted = await aesEncrypt(PLAINTEXT, PASSWORD);
const encryptedCryptoJs = AES.encrypt(PLAINTEXT, PASSWORD).toString();

const suite = new Benchmark.Suite();

suite
  .add("aesDecrypt", async () => {
    const res = await aesDecrypt(encrypted, PASSWORD);
    if (res !== PLAINTEXT) {
      throw new Error("aesDecrypt failed");
    }
  })
  .add("aesDecryptCompat (modern)", async () => {
    const res = await aesDecryptCompat(encrypted, PASSWORD);
    if (res !== PLAINTEXT) {
      throw new Error("aesDecryptCompat (compat, modern) failed");
    }
  })
  .add("aesDecryptCompat (legacy)", async () => {
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

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name") + "\n");
  })
  .run({ async: true });
