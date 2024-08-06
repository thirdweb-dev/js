import { bench } from "vitest";
import { keccakId } from "./keccak-id.js";

bench("keccakId - Hello, World!", () => {
  keccakId("Hello, World!");
});
