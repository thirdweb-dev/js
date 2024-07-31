import { describe, expect, test } from "vitest";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { typedData } from "../../test/src/typed-data.js";
import { mainnet } from "../chains/chain-definitions/ethereum.js";
import { signTypedData } from "../utils/signatures/sign-typed-data.js";
import { verifyTypedData } from "./verify-typed-data.js";

describe.runIf(process.env.TW_SECRET_KEY)("verifyTypedData", async () => {
  test("valid EOA signature", async () => {
    const signature = signTypedData({
      ...typedData.basic,
      primaryType: "Mail",
      privateKey: ANVIL_PKEY_A,
    });

    expect(
      await verifyTypedData({
        ...typedData.basic,
        primaryType: "Mail",
        address: TEST_ACCOUNT_A.address,
        signature,
        chain: mainnet,
        client: TEST_CLIENT,
      }),
    ).toBe(true);
  });

  test("invalid EOA signature", async () => {
    expect(
      await verifyTypedData({
        ...typedData.basic,
        primaryType: "Mail",
        address: TEST_ACCOUNT_A.address,
        signature: "0xdead",
        chain: mainnet,
        client: TEST_CLIENT,
      }),
    ).toBe(false);
  });

  test("valid smart account signature", async () => {
    expect(
      await verifyTypedData({
        ...typedData.basic,
        primaryType: "Mail",
        address: "0x3FCf42e10CC70Fe75A62EB3aDD6D305Aa840d145",
        signature:
          "0x79d756d805073dc97b7bc885b0d56ddf319a2599530fe1e178c2a7de5be88980068d24f20a79b318ea0a84d33ae06f93db77e4235e5d9eeb8b1d7a63922ada3e1c",
        chain: mainnet,
        client: TEST_CLIENT,
      }),
    ).toBe(true);
  });

  test("invalid smart account signature", async () => {
    expect(
      await verifyTypedData({
        ...typedData.basic,
        primaryType: "Mail",
        address: "0x3FCf42e10CC70Fe75A62EB3aDD6D305Aa840d145",
        signature: "0xdead",
        chain: mainnet,
        client: TEST_CLIENT,
      }),
    ).toBe(false);
  });

  test("non-existent account", async () => {
    expect(
      await verifyTypedData({
        ...typedData.basic,
        primaryType: "Mail",
        address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        signature:
          "0x79d756d805073dc97b7bc885b0d56ddf319a2599530fe1e178c2a7de5be88980068d24f20a79b318ea0a84d33ae06f93db77e4235e5d9eeb8b1d7a63922ada3e1c",
        chain: mainnet,
        client: TEST_CLIENT,
      }),
    ).toBe(false);
  });
});
