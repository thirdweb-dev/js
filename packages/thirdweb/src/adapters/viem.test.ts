import { zeroAddress } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { privateKeyAccount } from "../wallets/private-key.js";
import { viemAdapter } from "./viem.js";

import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { typedData } from "~test/typed-data.js";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { mainnet } from "../chains/chain-definitions/ethereum.js";

const account = privateKeyAccount({
  privateKey: ANVIL_PKEY_A,
  client: TEST_CLIENT,
});

describe("walletClient.toViem", () => {
  let walletClient: ReturnType<typeof viemAdapter.walletClient.toViem>;

  beforeAll(() => {
    walletClient = viemAdapter.walletClient.toViem({
      client: TEST_CLIENT,
      account,
      chain: ANVIL_CHAIN,
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

  test("should contain a json-rpc account", async () => {
    expect(walletClient.account?.type).toBe("json-rpc");
  });

  test("should send a transaction", async () => {
    if (!walletClient.account) {
      throw new Error("Account not found");
    }
    const txHash = await walletClient.sendTransaction({
      to: zeroAddress,
      value: 0n,
    });
    expect(txHash).toBeDefined();
    expect(txHash.slice(0, 2)).toBe("0x");
  });

  test("should get address on live chain", async () => {
    walletClient = viemAdapter.walletClient.toViem({
      client: TEST_CLIENT,
      account,
      chain: mainnet,
    });

    const address = await walletClient.getAddresses();
    expect(address[0]).toBeDefined();
    expect(address[0]).toBe(account.address);
  });
});
