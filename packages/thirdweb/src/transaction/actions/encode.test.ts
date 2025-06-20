import { describe, expect, it } from "vitest";
import { TEST_WALLET_A, TEST_WALLET_B } from "~test/addresses.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { USDT_CONTRACT, USDT_CONTRACT_WITH_ABI } from "~test/test-contracts.js";
import { concatHex } from "../../utils/encoding/helpers/concat-hex.js";
import { toHex } from "../../utils/encoding/hex.js";
import { toWei } from "../../utils/units.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { prepareTransaction } from "../prepare-transaction.js";
import { resolveMethod } from "../resolve-method.js";
import { encode, getDataFromTx, getExtraCallDataFromTx } from "./encode.js";

const USDC_TRANSFER_ENCODE_RESULT =
  "0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064";

const extraCallDataMsg = "Hello, World";
const extraCallData = toHex(extraCallDataMsg);
const expectedFinalData = concatHex([
  USDC_TRANSFER_ENCODE_RESULT,
  extraCallData,
]);

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

  // Repeat the same test cases above but now with extraCallData

  it("extraCallData | should encode correctly (human-readable)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      extraCallData,
      method: "function transfer(address, uint256) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(expectedFinalData);
  });

  it("extraCallData | should encode correctly (transaction abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      extraCallData,
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
    expect(encoded).toEqual(expectedFinalData);
  });

  it("extraCallData | should encode correctly (contract abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT_WITH_ABI,
      extraCallData,
      method: "transfer",
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(expectedFinalData);
  });
  it("extraCallData | should encode correctly (auto-abi)", async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      extraCallData,
      method: resolveMethod("transfer"),
      params: [TEST_WALLET_A, 100n],
    });
    const encoded = await encode(tx);
    expect(encoded).toEqual(expectedFinalData);
  });

  it("extraCallData - should work with prepareTransaction", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    const encoded = await encode(tx);

    const txWithExtraData = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      extraCallData,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });

    const encoded2 = await encode(txWithExtraData);
    expect(encoded2).toBe(concatHex([encoded, extraCallData]));
  });

  it("internal func: getDataFromTx | should return `0x` if no data is attached", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    const _hex = await getDataFromTx(tx);
    expect(_hex).toBe("0x");
  });

  it("internal func: getDataFromTx | should return correctly encoded data", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      data: extraCallData,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    const _hex = await getDataFromTx(tx);
    expect(_hex).toBe(extraCallData);
  });

  it("internal func: getExtraCallDataFromTx | should return `undefined` if no data is attached", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    const result = await getExtraCallDataFromTx(tx);
    expect(result).toBe(undefined);
  });

  it("internal func: getExtraCallDataFromTx | should return correct extraCallData", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      data: toHex("getExtraCallDataFromTx-should-not-return-this"),
      extraCallData,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    const result = await getExtraCallDataFromTx(tx);
    expect(result).toBe(extraCallData);
  });

  it("internal func: getExtraCallDataFromTx | should throw error if extraCallData is not hex-encoded", async () => {
    const tx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      data: toHex("getExtraCallDataFromTx-should-not-return-this"),
      // @ts-ignore Intentionally for the test purpose
      extraCallData: "I'm a cat",
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    await expect(getExtraCallDataFromTx(tx)).rejects.toThrowError(
      "Invalid extra calldata - must be a hex string",
    );
  });
});
