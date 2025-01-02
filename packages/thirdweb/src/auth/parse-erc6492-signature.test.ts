import { describe } from "node:test";
import { expect, it } from "vitest";
import { ANVIL_PKEY_A } from "../../test/src/test-wallets.js";
import { signMessage } from "../utils/signatures/sign-message.js";
import { parseErc6492Signature } from "./parse-erc6492-signature.js";

describe("parseErc6492Signature", () => {
  const signature = signMessage({
    message: "hello world",
    privateKey: ANVIL_PKEY_A,
  });

  it("should return original signature for non-ERC-6492 signature", () => {
    expect(parseErc6492Signature(signature)).toEqual({ signature });
  });

  it("should return object with address, data, and signature for ERC-6492 signature", () => {
    expect(
      parseErc6492Signature(
        "0x000000000000000000000000cafebabecafebabecafebabecafebabecafebabe000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000004deadbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041a461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b000000000000000000000000000000000000000000000000000000000000006492649264926492649264926492649264926492649264926492649264926492",
      ),
    ).toMatchInlineSnapshot(`
        {
          "address": "0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe",
          "data": "0xdeadbeef",
          "signature": "0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b",
        }
      `);
  });
});
