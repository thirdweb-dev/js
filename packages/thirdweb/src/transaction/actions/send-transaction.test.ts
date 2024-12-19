import * as ox__Hex from "ox/Hex";
import { describe, expect, it, vi } from "vitest";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { privateKeyToAccount } from "../../wallets/private-key.js";
import { getWalletBalance } from "../../wallets/utils/getWalletBalance.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { prepareTransaction } from "../prepare-transaction.js";
import * as TransactionStore from "../transaction-store.js";
import { sendAndConfirmTransaction } from "./send-and-confirm-transaction.js";
import { sendTransaction } from "./send-transaction.js";

const addTransactionToStore = vi.spyOn(
  TransactionStore,
  "addTransactionToStore",
);

describe("sendTransaction", () => {
  it("should send transaction", async () => {
    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      value: 100n,
      to: TEST_WALLET_B,
    });
    const res = await sendTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });

    expect(res.transactionHash.length).toBe(66);
  });

  it.only("should send an eip7702 transaction", async () => {
    const account = TEST_ACCOUNT_A;
    const delegate = privateKeyToAccount({
      privateKey: "",
      client: TEST_CLIENT,
    });

    const chain = defineChain(911867);
    console.log(
      "BALANCE BEFORE",
      await getWalletBalance({
        address: delegate.address,
        chain,
        client: TEST_CLIENT,
      }),
    );

    const nonce = await (async () => {
      const rpcRequest = getRpcClient({
        chain,
        client: TEST_CLIENT,
      });
      const { eth_getTransactionCount } = await import(
        "../../rpc/actions/eth_getTransactionCount.js"
      );
      return await eth_getTransactionCount(rpcRequest, {
        address: account.address,
        blockTag: "pending",
      });
    })();

    const signedAuthorization = await account.signAuthorization!({
      address: "0x654F42b74885EE6803F403f077bc0409f1066c58",
      chainId: chain.id,
      nonce: BigInt(nonce),
    });

    for (let i = 0; i < 2; i++) {
      const batchSend = prepareContractCall({
        contract: getContract({
          address: account.address,
          chain,
          client: TEST_CLIENT,
        }),
        method:
          "function execute((bytes data, address to, uint256 value)[] calldata calls) external payable",
        authorizationList: [
          {
            ...signedAuthorization,
            contractAddress: signedAuthorization.address,
            nonce: Number(signedAuthorization.nonce),
            r: ox__Hex.fromNumber(signedAuthorization.r),
            s: ox__Hex.fromNumber(signedAuthorization.s),
          },
        ],
        params: [
          [
            {
              to: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
              value: 10000n,
              data: "0x",
            },
            {
              to: "0xb4b5fa134b9640B19d6cd980b3808AD9980D7e14",
              value: 10000n,
              data: "0x",
            },
          ],
        ],
      });

      const batchSendResult = await sendAndConfirmTransaction({
        account: delegate,
        transaction: batchSend,
      });
      console.log("BATCH SEND RESULT", batchSendResult.transactionHash);

      expect(batchSendResult.transactionHash.length).toBe(66);

      console.log(
        "BALANCE AFTER",
        await getWalletBalance({
          address: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
          chain,
          client: TEST_CLIENT,
        }),
        await getWalletBalance({
          address: "0xb4b5fa134b9640B19d6cd980b3808AD9980D7e14",
          chain,
          client: TEST_CLIENT,
        }),
      );
    }
  });

  it("should add transaction to session", async () => {
    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      value: 100n,
      to: TEST_WALLET_B,
    });
    await sendTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });

    expect(addTransactionToStore).toHaveBeenCalled();
  });
});
