import { describe, expect, it } from "vitest";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import type { Authorization } from "./authorization.js";
import { signAuthorization, signAuthorizations } from "./sign-authorization.js";

describe("signAuthorization", () => {
  it("should sign a single authorization", async () => {
    const signedAuth = await signAuthorization({
      authorization: {
        address: TEST_ACCOUNT_B.address,
        chainId: 1,
        nonce: 420n,
      },
      account: TEST_ACCOUNT_A,
    });

    expect(signedAuth).toMatchInlineSnapshot(`
      {
        "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "chainId": 1,
        "nonce": 420n,
        "r": 102725860776773423628916613503801445158901377966270769628473190730870496434730n,
        "s": 25812735492740097245003859854864857180049536150520605332837906559451311728806n,
        "yParity": 0,
      }
    `);
  });
});

describe("signAuthorizations", () => {
  it("should sign multiple authorizations", async () => {
    const authorizations: Authorization[] = [
      {
        address: TEST_ACCOUNT_B.address,
        chainId: 1,
        nonce: 420n,
      },
      {
        address: TEST_ACCOUNT_C.address,
        chainId: 1,
        nonce: 421n,
      },
    ];

    const authorizationList = await signAuthorizations({
      authorizations,
      account: TEST_ACCOUNT_A,
    });

    expect(authorizationList).toMatchInlineSnapshot(`
      [
        {
          "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          "chainId": 1,
          "nonce": 420n,
          "r": 102725860776773423628916613503801445158901377966270769628473190730870496434730n,
          "s": 25812735492740097245003859854864857180049536150520605332837906559451311728806n,
          "yParity": 0,
        },
        {
          "address": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          "chainId": 1,
          "nonce": 421n,
          "r": 108482619199996736781930236539430222748019956875459721295513303884715556878431n,
          "s": 17328756565811311106451462386592517658555637219672290207851357199682941049520n,
          "yParity": 0,
        },
      ]
    `);
  });
});
