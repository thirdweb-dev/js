import { describe, test, expect, beforeAll } from "vitest";
import { privateKeyAccount } from "../wallets/private-key.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { viemAdapter } from "./viem.js";
import { defineChain } from "../chains/utils.js";
import type { WalletClient } from "viem";

import { typedData } from "~test/typed-data.js";
import { ANVIL_PKEY_A } from "~test/test-wallets.js";

const account = privateKeyAccount({
  privateKey: ANVIL_PKEY_A,
  client: TEST_CLIENT,
});

describe("walletClient.toViem", () => {
  let walletClient: WalletClient;

  beforeAll(() => {
    walletClient = viemAdapter.walletClient.toViem({
      client: TEST_CLIENT,
      account,
      chain: defineChain(31337),
    });
  });

  test("should return an viem wallet client", async () => {
    expect(walletClient).toBeDefined();
    expect(walletClient.signMessage).toBeDefined();
  });

  test("should sign typed data", async () => {
    expect(walletClient.signTypedData).toBeDefined();

    if (!walletClient.account) {
      throw new Error("Account not found");
    }

    const signature = await walletClient.signTypedData({
      ...typedData.basic,
      primaryType: "Mail",
      account: walletClient.account,
    });

    expect(signature).toMatchInlineSnapshot(
      `"0x32f3d5975ba38d6c2fba9b95d5cbed1febaa68003d3d588d51f2de522ad54117760cfc249470a75232552e43991f53953a3d74edf6944553c6bef2469bb9e5921b"`,
    );
  });

  test("should contain a local account", async () => {
    expect(walletClient.account?.type).toBe("local");
  });
});
