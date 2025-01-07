import { describe, expect, it } from "vitest";
import { TEST_WALLET_B } from "~test/addresses.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { signAuthorization } from "./authorization.js";

describe("signAuthorization", () => {
  it("should sign an authorization", async () => {
    const authorization = await signAuthorization({
      account: TEST_ACCOUNT_A,
      request: {
        address: TEST_WALLET_B,
        chainId: 911867,
        nonce: 0n,
      },
    });
    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000002",
        "chainId": 911867,
        "nonce": 0n,
        "r": 3720526934953059641417422884731844424204826752871127418111522219225437830766n,
        "s": 23451045058292828843243765241045958975073226494910356096978666517928790374894n,
        "yParity": 1,
      }
    `);
  });
});
