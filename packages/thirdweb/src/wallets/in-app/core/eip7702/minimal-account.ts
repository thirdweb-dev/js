import type { Definition, TypedData } from "ox/TypedData";
import type { Hex, SignableMessage } from "viem";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getBytecode } from "../../../../contract/actions/get-bytecode.js";
import {
  getContract,
  type ThirdwebContract,
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
  "0xD6999651Fc0964B9c6B444307a0ab20534a66560";

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
      chain,
      client,
    });
    // check if account has been delegated already
    let authorization: SignedAuthorization | undefined;
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
          data: tx.data ?? "0x", // will throw if undefined address
          target: getAddress(tx.to ?? ""),
          value: tx.value ?? 0n,
        })),
        uid: randomBytesHex(),
      };
      const signature = await adminAccount.signTypedData({
        domain: {
          chainId: firstTx.chainId,
          name: "MinimalAccount",
          verifyingContract: eoaContract.address,
          version: "1",
        },
        message: wrappedCalls,
        primaryType: "WrappedCalls",
        types: {
          Call: [
            { name: "target", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
          ],
          WrappedCalls: [
            { name: "calls", type: "Call[]" },
            { name: "uid", type: "bytes32" },
          ],
        },
      });

      const result = await executeWithSignature({
        authorization,
        eoaAddress: getAddress(adminAccount.address),
        options: {
          chain: getCachedChain(firstTx.chainId),
          client,
        },
        signature,
        wrappedCalls,
      });

      const transactionHash = await waitForTransactionHash({
        options: {
          chain: getCachedChain(firstTx.chainId),
          client,
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
      calls: txs.map((tx) => ({
        data: tx.data ?? "0x",
        target: tx.to ?? "",
        value: tx.value ?? 0n,
      })),
      contract: eoaContract,
      overrides: {
        authorizationList: authorization ? [authorization] : undefined,
        value: txs.reduce((acc, tx) => acc + (tx.value ?? 0n), 0n),
      },
    });
    // re-estimate gas for the entire batch + authorization
    const serializedTx = await toSerializableTransaction({
      from: adminAccount.address,
      transaction: executeTx,
    });
    return adminAccount.sendTransaction(serializedTx);
  };

  const minimalAccount: Account = {
    address: adminAccount.address,
    sendBatchTransaction: async (
      txs: SendTransactionOption[],
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization(txs);
    },
    sendTransaction: async (
      tx: SendTransactionOption,
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization([tx]);
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
      adminAccount.signMessage({ chainId, message, originalMessage }),
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
