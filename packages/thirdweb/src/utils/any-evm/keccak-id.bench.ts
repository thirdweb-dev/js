import { bench } from "vitest";
import { keccakId } from "./keccak-id.js";

const input = "Hello, World!";

bench("keccakId", () => {
  keccakId(input);
});
