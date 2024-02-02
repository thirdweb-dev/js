import { USDC_CONTRACT, USDC_CONTRACT_WITH_ABI } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { prepareTransaction } from "~thirdweb/transaction/transaction.js";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveAbiFunction } from "./resolve-abi.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const USDC_PARSED_ABI_FN = {
  inputs: [
    {
      name: "to",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
  ],
  name: "transfer",
  outputs: [
    {
      type: "bool",
    },
  ],
  stateMutability: "nonpayable",
  type: "function",
};

describe("transaction: resolve-abi", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });
  it("should parse correctly (human-readable)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction = await resolveAbiFunction(tx);
    expect(abiFunction).toMatchObject(USDC_PARSED_ABI_FN);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should parse correctly (transaction abi)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      method: {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction = await resolveAbiFunction(tx);
    expect(abiFunction).toMatchObject(USDC_PARSED_ABI_FN);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should parse correctly (contract abi)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT_WITH_ABI,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction = await resolveAbiFunction(tx);
    expect(abiFunction).toMatchObject(USDC_PARSED_ABI_FN);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should parse correctly (auto-abi)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction = await resolveAbiFunction(tx);
    expect(abiFunction).toMatchObject(USDC_PARSED_ABI_FN);
    // we should have called the contract metadata endpoint exactly once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  // check that cache works
  it("should cache the value for the same transaction", async () => {
    const tx = prepareTransaction({
      // "new" contract object to not hit contract level caching here
      contract: { ...USDC_CONTRACT },
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction1 = await resolveAbiFunction(tx);
    expect(abiFunction1).toMatchObject(USDC_PARSED_ABI_FN);
    // we should have called the contract metadata endpoint exactly once
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const abiFunction2 = await resolveAbiFunction(tx);
    expect(abiFunction2).toMatchObject(USDC_PARSED_ABI_FN);
    // should still only have been called once!
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  // check errors
  it("should throw an error if the method is not a function", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      // peak the incorrect method
      method: "notFunction transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const abiFunction = resolveAbiFunction(tx);
    expect(abiFunction).rejects.toThrowError();

    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
