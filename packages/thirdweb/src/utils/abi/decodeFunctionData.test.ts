import { expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { decodeFunctionData } from "./decodeFunctionData.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "decodes function data correctly",
  async () => {
    const result = await decodeFunctionData({
      contract: getContract({
        address: "0x9480d58e14b1851a2A3C7aEFAd17D48e31D3F93b",
        client: TEST_CLIENT,
        chain: defineChain(17177),
      }),
      data: "0xd8fd8f44000000000000000000000000f117ed9dcc8960062484b781097321c8380cead30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002466353238316131632d363830352d343536622d623738322d38356165326165623336643800000000000000000000000000000000000000000000000000000000",
    });
    expect(result).toMatchInlineSnapshot(`
      [
        "0xf117ed9dcc8960062484b781097321c8380cead3",
        "0x66353238316131632d363830352d343536622d623738322d383561653261656233366438",
      ]
    `);
  },
);
