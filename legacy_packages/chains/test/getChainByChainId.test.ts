import { expect, test } from "vitest";
import { getChainByChainId, Goerli } from "../src";

test("expect chainId 5 to be goerli", () => {
  expect(getChainByChainId(5)).toBe(Goerli);
});
