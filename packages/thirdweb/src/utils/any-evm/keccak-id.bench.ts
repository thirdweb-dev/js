import { describe, bench } from "vitest";
import { keccakId } from "./keccak-id.js";
import { id } from "ethers6";

const input = "Hello, World!";
describe("keccackId", () => {
  bench("thirdweb", () => {
    keccakId(input);
  });
  bench("ethers", () => {
    id(input);
  });
});
