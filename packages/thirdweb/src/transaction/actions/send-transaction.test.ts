import { describe, expect, it, vi } from "vitest";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc20/drops/write/claimTo.js";
import { getWalletBalance } from "../../wallets/utils/getWalletBalance.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { prepareTransaction } from "../prepare-transaction.js";
import * as TransactionStore from "../transaction-store.js";
import { encode } from "./encode.js";
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
    const executor = TEST_ACCOUNT_B;

    console.log("ACCOUNT", account.address);
    console.log("DELEGATE", executor.address);

    const chain = defineChain(911867);
    const tokenContract = getContract({
      address: "0xAA462a5BE0fc5214507FDB4fB2474a7d5c69065b",
      chain,
      client: TEST_CLIENT,
    });

    const claimTx = claimTo({
      contract: tokenContract,
      quantityInWei: 1000n,
      to: account.address,
    });

    // const transferTx = transfer({
    //   contract: tokenContract,
    //   amountWei: 1000n,
    //   to: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
    // });

    console.log(
      "BALANCE BEFORE",
      await getWalletBalance({
        address: account.address,
        chain,
        client: TEST_CLIENT,
        tokenAddress: tokenContract.address,
      }),
    );

    // const nonce = await (async () => {
    //   const rpcRequest = getRpcClient({
    //     chain,
    //     client: TEST_CLIENT,
    //   });
    //   const { eth_getTransactionCount } = await import(
    //     "../../rpc/actions/eth_getTransactionCount.js"
    //   );
    //   return await eth_getTransactionCount(rpcRequest, {
    //     address: account.address,
    //     blockTag: "pending",
    //   });
    // })();

    // const signedAuthorization = await account.signAuthorization!({
    //   address: "0x654F42b74885EE6803F403f077bc0409f1066c58",
    //   chainId: chain.id,
    //   nonce: BigInt(nonce),
    // });

    // console.log("SIGNED AUTHORIZATION", signedAuthorization);

    const batchSend = prepareContractCall({
      contract: getContract({
        address: account.address,
        chain,
        client: TEST_CLIENT,
      }),
      method:
        "function execute((bytes data, address to, uint256 value)[] calldata calls) external payable",
      // authorizationList: [signedAuthorization],
      params: [
        [
          {
            data: await encode(claimTx),
            to: tokenContract.address,
            value: 0n,
          },
        ],
      ],
    });

    const batchSendResult = await sendAndConfirmTransaction({
      account: executor,
      transaction: batchSend,
    });
    console.log("BATCH SEND RESULT", batchSendResult.transactionHash);

    expect(batchSendResult.transactionHash.length).toBe(66);

    console.log(
      "BALANCE AFTER",
      await getWalletBalance({
        address: account.address,
        chain,
        client: TEST_CLIENT,
        tokenAddress: tokenContract.address,
      }),
    );
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
