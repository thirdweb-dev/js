import { describe, expect, it } from "vitest";
import { ANVIL_PKEY_A } from "../../test/src/test-wallets.js";
import { signMessage } from "../utils/signatures/sign-message.js";
import { isErc6492Signature } from "./is-erc6492-signature.js";
import { serializeErc6492Signature } from "./serialize-erc6492-signature.js";

describe("default", () => {
  const signature = signMessage({
    message: "hello world",
    privateKey: ANVIL_PKEY_A,
  });

  it("should return false for a standard signature", async () => {
    expect(isErc6492Signature(signature)).toBe(false);
  });

  it("should return true for an ERC-6492 signature", () => {
    const signatureWithMagicValue = serializeErc6492Signature({
      address: "0xcafebabecafebabecafebabecafebabecafebabe",
      data: "0xdeadbeef",
      signature,
    });

    expect(isErc6492Signature(signatureWithMagicValue)).toBe(true);
  });
});
