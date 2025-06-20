import type { Definition, TypedData } from "ox/TypedData";
import type { Hex, SignableMessage } from "viem";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getBytecode } from "../../../../contract/actions/get-bytecode.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { execute } from "../../../../extensions/erc7702/__generated__/MinimalAccount/write/execute.js";
import type { SignedAuthorization } from "../../../../transaction/actions/eip7702/authorization.js";
import { toSerializableTransaction } from "../../../../transaction/actions/to-serializable-transaction.js";
import type { SendTransactionResult } from "../../../../transaction/types.js";
import { getAddress } from "../../../../utils/address.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import {
  executeWithSignature,
  getQueuedTransactionHash,
} from "../../../smart/lib/bundler.js";
import type { BundlerOptions } from "../../../smart/types.js";

const MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS =
  "0x173217d7f8c26Dc3c01e37e1c04813CC7cC9fEc2";

export const create7702MinimalAccount = (args: {
  client: ThirdwebClient;
  adminAccount: Account;
  sponsorGas?: boolean;
}): Account => {
  const { client, adminAccount, sponsorGas } = args;

  const _sendTxWithAuthorization = async (txs: SendTransactionOption[]) => {
    const firstTx = txs[0];
    if (!firstTx) {
      throw new Error("No transactions provided");
    }
    const chain = getCachedChain(firstTx.chainId);
    const eoaContract = getContract({
      address: adminAccount.address,
      client,
      chain,
    });
    // check if account has been delegated already
    let authorization: SignedAuthorization | undefined = undefined;
    const isMinimalAccount = await is7702MinimalAccount(eoaContract);
    if (!isMinimalAccount) {
      // if not, sign authorization
      const nonce = firstTx.nonce
        ? BigInt(firstTx.nonce) + (sponsorGas ? 0n : 1n)
        : 0n; // TODO (7702): get remote nonce if not provided, should be in the tx though
      const auth = await adminAccount.signAuthorization?.({
        address: MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS,
        chainId: firstTx.chainId,
        nonce,
      });
      if (!auth) {
        throw new Error("Failed to sign authorization");
      }
      authorization = auth;
    }
    if (sponsorGas) {
      // send transaction from executor, needs signature
      const wrappedCalls = {
        calls: txs.map((tx) => ({
          target: getAddress(tx.to ?? ""), // will throw if undefined address
          value: tx.value ?? 0n,
          data: tx.data ?? "0x",
        })),
        uid: randomBytesHex(),
      };
      const signature = await adminAccount.signTypedData({
        domain: {
          name: "MinimalAccount",
          version: "1",
          chainId: firstTx.chainId,
          verifyingContract: eoaContract.address,
        },
        types: {
          WrappedCalls: [
            { name: "calls", type: "Call[]" },
            { name: "uid", type: "bytes32" },
          ],
          Call: [
            { name: "target", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
          ],
        },
        message: wrappedCalls,
        primaryType: "WrappedCalls",
      });

      const result = await executeWithSignature({
        eoaAddress: getAddress(adminAccount.address),
        wrappedCalls,
        signature,
        authorization,
        options: {
          client,
          chain: getCachedChain(firstTx.chainId),
        },
      });

      const transactionHash = await waitForTransactionHash({
        options: {
          client,
          chain: getCachedChain(firstTx.chainId),
        },
        transactionId: result.transactionId,
      });
      return {
        transactionHash,
      };
    }
    // send transaction from EOA
    // wrap txs in a single execute call to the MinimalAccount
    const executeTx = execute({
      contract: eoaContract,
      calls: txs.map((tx) => ({
        target: tx.to ?? "",
        value: tx.value ?? 0n,
        data: tx.data ?? "0x",
      })),
      overrides: {
        value: txs.reduce((acc, tx) => acc + (tx.value ?? 0n), 0n),
        authorizationList: authorization ? [authorization] : undefined,
      },
    });
    // re-estimate gas for the entire batch + authorization
    const serializedTx = await toSerializableTransaction({
      transaction: executeTx,
      from: adminAccount.address,
    });
    return adminAccount.sendTransaction(serializedTx);
  };

  const minimalAccount: Account = {
    address: adminAccount.address,
    sendTransaction: async (
      tx: SendTransactionOption,
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization([tx]);
    },
    sendBatchTransaction: async (
      txs: SendTransactionOption[],
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization(txs);
    },
    signMessage: ({
      message,
      originalMessage,
      chainId,
    }: {
      message: SignableMessage;
      originalMessage?: string;
      chainId?: number;
    }): Promise<Hex> =>
      adminAccount.signMessage({ message, originalMessage, chainId }),
    signTypedData: <
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(
      _typedData: Definition<typedData, primaryType>,
    ): Promise<Hex> => adminAccount.signTypedData(_typedData),
  };
  return minimalAccount;
};

async function is7702MinimalAccount(
  eoaContract: ThirdwebContract,
): Promise<boolean> {
  const code = await getBytecode(eoaContract);
  const isDelegated = code.length > 0 && code.startsWith("0xef0100");
  const target = `0x${code.slice(8, 48)}`;
  return (
    isDelegated &&
    target.toLowerCase() ===
      MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS.toLowerCase()
  );
}

async function waitForTransactionHash(args: {
  options: BundlerOptions;
  transactionId: string;
  timeoutMs?: number;
  intervalMs?: number;
}): Promise<Hex> {
  const timeout = args.timeoutMs || 120000; // 2mins
  const interval = args.intervalMs || 1000; // 1s
  const endtime = Date.now() + timeout;
  while (Date.now() < endtime) {
    const result = await getQueuedTransactionHash({
      options: args.options,
      transactionId: args.transactionId,
    });
    if (result.transactionHash) {
      return result.transactionHash;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(
    `Timeout waiting for transaction to be mined on chain ${args.options.chain.id} with transactionId: ${args.transactionId}`,
  );
}
