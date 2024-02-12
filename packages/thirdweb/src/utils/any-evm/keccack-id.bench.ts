import { describe, bench } from "vitest";
import { keccackId } from "./keccack-id.js";
import { id } from "ethers6";

const input = "Hello, World!";
describe("keccackId", () => {
  bench("thirdweb", () => {
    keccackId(input);
  });
  bench("ethers", () => {
    id(input);
  });
});
