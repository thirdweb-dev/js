import * as ox__Hash from "ox/Hash";
import * as ox__Hex from "ox/Hex";
import * as ox__Signature from "ox/Signature";
import { recoverAddress } from "viem";
import { describe, expect, it } from "vitest";
import { serializeTransaction } from "../../transaction/serialize-transaction.js";
import { getKeylessTransaction } from "./keyless-transaction.js";

describe("getKeylessTransaction", () => {
  const mockTransaction = {
    chainId: 1,
    gasPrice: 10n,
    to: "0x1234567890123456789012345678901234567890",
    value: 1000n,
  };

  const mockSignature = {
    r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    v: 27n,
  } as const;

  it("should return the correct signer address and serialized transaction", async () => {
    const serializedTransaction = serializeTransaction({
      transaction: mockTransaction,
    });

    const hash = ox__Hash.keccak256(serializedTransaction);
    const expectedAddress = await recoverAddress({
      hash,
      signature: ox__Signature.toHex({
        r: ox__Hex.toBigInt(mockSignature.r),
        s: ox__Hex.toBigInt(mockSignature.s),
        yParity: ox__Signature.vToYParity(Number(mockSignature.v)),
      }),
    });

    const result = await getKeylessTransaction({
      signature: mockSignature,
      transaction: mockTransaction,
    });

    expect(result.signerAddress).toBe(expectedAddress);
    expect(result.transaction).toBe(
      serializeTransaction({
        signature: mockSignature,
        transaction: mockTransaction,
      }),
    );
  });

  it("should throw if yParity is explicitly undefined", async () => {
    const invalidSignature = {
      r: mockSignature.r,
      s: mockSignature.s,
      yParity: undefined,
    };

    await expect(
      getKeylessTransaction({
        // biome-ignore lint/suspicious/noExplicitAny: Testing invalid data
        signature: invalidSignature as any,
        transaction: mockTransaction,
      }),
    ).rejects.toThrow();
  });

  it("should throw if a signature is not recoverable", async () => {
    const invalidSignature = { ...mockSignature, v: undefined };

    await expect(
      getKeylessTransaction({
        // biome-ignore lint/suspicious/noExplicitAny: Testing invalid data
        signature: invalidSignature as any,
        transaction: mockTransaction,
      }),
    ).rejects.toThrow();
  });

  it("should throw an error if the transaction is invalid", async () => {
    const invalidTransaction = { ...mockTransaction, value: "invalid" };

    await expect(
      getKeylessTransaction({
        signature: mockSignature,
        // biome-ignore lint/suspicious/noExplicitAny: Testing invalid data
        transaction: invalidTransaction as any,
      }),
    ).rejects.toThrow();
  });
});
