import { USDC_CONTRACT, USDC_CONTRACT_WITH_ABI } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { prepareTransaction } from "~thirdweb/transaction/transaction.js";
import { encode } from "./encode.js";
import { describe, it, expect, vi } from "vitest";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const USDC_TRANSFER_ENCODE_RESULT =
  "0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064";

describe("transaction: encode", () => {
  it("should encode correctly (human-readable)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should encode correctly (transaction abi)", async () => {
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
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should encode correctly (contract abi)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT_WITH_ABI,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
    // we should not have made any network requests
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should encode correctly (auto-abi)", async () => {
    const tx = prepareTransaction({
      contract: USDC_CONTRACT,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
    // we should have called the contract metadata endpoint exactly once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
