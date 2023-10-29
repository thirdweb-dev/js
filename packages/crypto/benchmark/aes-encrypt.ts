import Benchmark from "benchmark";
import { aesEncrypt } from "../src";
import { AES } from "crypto-js";

const PLAINTEXT = "my secret text";
const PASSWORD = "pw";

const suite = new Benchmark.Suite();

suite
  .add("aesEncrypt", async () => {
    await aesEncrypt(PLAINTEXT, PASSWORD);
  })
  .add("crypto-js", () => {
    AES.encrypt(PLAINTEXT, PASSWORD).toString();
  });

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name") + "\n");
  })
  .run({ async: true });
