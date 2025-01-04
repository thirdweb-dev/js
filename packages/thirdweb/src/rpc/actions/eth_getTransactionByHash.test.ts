import { describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getRpcClient } from "../rpc.js";
import { eth_getTransactionByHash } from "./eth_getTransactionByHash.js";

const client = TEST_CLIENT;
const chain = FORKED_ETHEREUM_CHAIN;
const rpcRequest = getRpcClient({ client, chain });

describe.runIf(process.env.TW_SECRET_KEY)("eth_getTransactionByHash", () => {
  it("should get the transaction data", async () => {
    const data = await eth_getTransactionByHash(rpcRequest, {
      hash: "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060",
    });
    expect(data).toStrictEqual({
      hash: "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060",
      nonce: 0,
      blockHash:
        "0x4e3a3754410177e6937ef1f84bba68ea139e8d1a2258c5f85db9f1cd715a1bdd",
      blockNumber: 46147n,
      transactionIndex: 0,
      from: "0xa1e4380a3b1f749673e270229993ee55f35663b4",
      to: "0x5df9b87991262f6ba471f09758cde1c0fc1de734",
      value: 31337n,
      gasPrice: 50000000000000n,
      gas: 21000n,
      input: "0x",
      r: "0x88ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0",
      s: "0x45e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33a",
      v: 28n,
      chainId: 1,
      type: "legacy",
      typeHex: "0x0",
    });
  });

  it("should throw error if failed to get tx data", async () => {
    await expect(() =>
      eth_getTransactionByHash(rpcRequest, {
        hash: "0x09ca5e3fa3d6d983fc13c6f74f6b466a7ec88c6ef7b906f24c4e7fefef403f10",
      }),
    ).rejects.toThrowError("Transaction not found.");
  });

  it("throw error with GENESIS_ transaction hash (?)", async () => {
    await expect(() =>
      eth_getTransactionByHash(rpcRequest, {
        // @ts-ignore Test
        hash: "GENESIS_756f45e3fa69347a9a973a725e3c98bc4db0b5a0",
      }),
    ).rejects.toThrowError();
  });
});
