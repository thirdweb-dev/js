import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import { DROP1155_CONTRACT } from "~test/test-contracts.js";
import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import { isLazyMintSupported } from "./lazyMint.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc1155: lazyMint", () => {
  it("`isLazyMintSupported` should work with our Edition Drop contracts", async () => {
    const abi = await resolveContractAbi<Abi>(DROP1155_CONTRACT);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isLazyMintSupported(selectors)).toBe(true);
  });
});
