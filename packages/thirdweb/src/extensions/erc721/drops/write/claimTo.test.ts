import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import { NFT_DROP_CONTRACT } from "~test/test-contracts.js";
import { resolveContractAbi } from "../../../../contract/actions/resolve-abi.js";
import { isClaimToSupported } from "./claimTo.js";

describe.runIf(process.env.TW_SECRET_KEY)("ERC721: claimTo", () => {
  it("isClaimToSupported should work", async () => {
    const abi = await resolveContractAbi<Abi>(NFT_DROP_CONTRACT);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isClaimToSupported(selectors)).toBe(true);
  });
});
