import { describe, expect, it } from "vitest";
import { TEST_WALLET_A } from "~test/addresses.js";
import { USDT_CONTRACT, USDT_CONTRACT_WITH_ABI } from "~test/test-contracts.js";
import { encode } from "./encode.js";

import { prepareContractCall } from "../prepare-contract-call.js";
import { resolveMethod } from "../resolve-method.js";

const USDC_TRANSFER_ENCODE_RESULT =
  "0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064";

describe("transaction: encode", () => {
  it("should encode correctly (human-readable)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      method: "function transfer(address, uint256) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
  });

  it("should encode correctly (transaction abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
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
  });

  it("should encode correctly (contract abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT_WITH_ABI,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
  });

  it("should encode correctly (auto-abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      method: resolveMethod("transfer"),
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(USDC_TRANSFER_ENCODE_RESULT);
  });
});
