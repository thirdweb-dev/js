import { defineChain as viemChain } from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { getRpcClient, prepareTransaction } from "../exports/thirdweb.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { defineChain } from "./utils.js";

describe("defineChain", () => {
  it("should convert viem chain to thirdweb chain", () => {
    const zoraViem = viemChain({
      id: 7777777,
      name: "Zora",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: ["https://rpc.zora.energy"],
          webSocket: ["wss://rpc.zora.energy"],
        },
      },
      blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.zora.energy" },
      },
    });
    const thirdwebViem = defineChain(zoraViem);

    expect(thirdwebViem.id).toEqual(zoraViem.id);
    expect(thirdwebViem.name).toEqual(zoraViem.name);
    expect(thirdwebViem.nativeCurrency).toEqual(zoraViem.nativeCurrency);
    expect(thirdwebViem.rpc).toEqual(zoraViem.rpcUrls.default.http[0]);
  });

  it("should not cache custom chains", async () => {
    const chain = defineChain({
      id: 123456789,
      name: "Test",
      rpc: "https://rpc.test.com",
    });
    expect(defineChain(123456789).rpc).not.toEqual(chain.rpc);
  });

  it("should overwrite custom chains with same id", async () => {
    const oldChain = defineChain({
      id: ANVIL_CHAIN.id,
      name: "Test",
      rpc: "FAIL",
    }); // this should get ignored
    getRpcClient({ chain: oldChain, client: TEST_CLIENT });

    const account = privateKeyToAccount({
      privateKey: ANVIL_PKEY_A,
      client: TEST_CLIENT,
    });
    const chain2 = defineChain({
      id: ANVIL_CHAIN.id,
      name: "Test2",
      rpc: ANVIL_CHAIN.rpc,
    }); // this should be the rpc used

    const tx = prepareTransaction({
      to: TEST_ACCOUNT_B.address,
      value: 100n,
      chain: chain2,
      client: TEST_CLIENT,
    });

    const serializableTransaction = await toSerializableTransaction({
      transaction: tx,
      from: account.address,
    });

    await account.sendTransaction(serializableTransaction);
    expect(defineChain(1).rpc).not.toEqual(chain2.rpc);
  });
});
