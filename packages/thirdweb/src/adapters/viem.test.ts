import { type Account as ViemAccount, zeroAddress } from "viem";
import { privateKeyToAccount as viemPrivateKeyToAccount } from "viem/accounts";
import { beforeAll, describe, expect, test } from "vitest";
import { USDT_ABI } from "~test/abis/usdt.js";
import {
  USDT_CONTRACT_ADDRESS,
  USDT_CONTRACT_WITH_ABI,
} from "~test/test-contracts.js";
import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { typedData } from "~test/typed-data.js";

import { ANVIL_CHAIN, FORKED_ETHEREUM_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { randomBytesBuffer } from "../utils/random.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { toViemContract, viemAdapter } from "./viem.js";

const account = privateKeyToAccount({
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

  test("should sign message", async () => {
    if (!walletClient.account) {
      throw new Error("Account not found");
    }
    const expectedSig = await account.signMessage({ message: "hello world" });
    const sig = await walletClient.signMessage({
      account: walletClient.account,
      message: "hello world",
    });
    expect(sig).toBe(expectedSig);
  });

  test("should sign raw message", async () => {
    if (!walletClient.account) {
      throw new Error("Account not found");
    }
    const bytes = randomBytesBuffer(32);
    const expectedSig = await account.signMessage({ message: { raw: bytes } });
    const sig = await walletClient.signMessage({
      account: walletClient.account,
      message: { raw: bytes },
    });
    expect(sig).toBe(expectedSig);
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
      account: walletClient.account,
      chain: {
        id: ANVIL_CHAIN.id,
        name: ANVIL_CHAIN.name || "",
        rpcUrls: {
          default: { http: [ANVIL_CHAIN.rpc] },
        },
        nativeCurrency: {
          name: ANVIL_CHAIN.nativeCurrency?.name || "Ether",
          symbol: ANVIL_CHAIN.nativeCurrency?.symbol || "ETH",
          decimals: ANVIL_CHAIN.nativeCurrency?.decimals || 18,
        },
      },
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
      chain: FORKED_ETHEREUM_CHAIN,
    });

    const address = await walletClient.getAddresses();
    expect(address[0]).toBeDefined();
    expect(address[0]).toBe(account.address);
  });

  test("should match thirdweb account signature", async () => {
    const message = "testing123";

    const rawViemAccount = viemPrivateKeyToAccount(ANVIL_PKEY_A);
    const twSignature = await account.signMessage({ message });
    const viemTwSignature = await walletClient.signMessage({
      message,
      account: walletClient.account as ViemAccount,
    });
    const viemSignature = await rawViemAccount.signMessage({ message });

    expect(viemSignature).toEqual(twSignature);
    expect(viemTwSignature).toEqual(twSignature);
  });

  test("should convert thirdweb contract to viem contract", async () => {
    const result = await toViemContract({
      thirdwebContract: USDT_CONTRACT_WITH_ABI,
    });
    expect(result.abi).toEqual(USDT_ABI);
    expect(result.address).toBe(USDT_CONTRACT_ADDRESS);
  });
});
