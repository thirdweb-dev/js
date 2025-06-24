import {
  type ExecutionOptions,
  signMessage,
  signTypedData,
  writeTransaction,
} from "@thirdweb-dev/engine";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { encode } from "../transaction/actions/encode.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import type {
  Account,
  SendTransactionOption,
} from "../wallets/interfaces/wallet.js";
import { waitForTransactionHash } from "./wait-for-tx-hash.js";

/**
 * Options for creating an server wallet.
 */
export type ServerWalletOptions = {
  /**
   * The thirdweb client to use for authentication to thirdweb services.
   */
  client: ThirdwebClient;
  /**
   * The vault access token to use your server wallet.
   */
  vaultAccessToken: string;
  /**
   * The server wallet address to use for sending transactions inside engine.
   */
  address: string;
  /**
   * The chain to use for signing messages and typed data (smart server wallet only).
   */
  chain?: Chain;
  /**
   * Optional custom execution options to use for sending transactions and signing data.
   */
  executionOptions?: Omit<ExecutionOptions, "chainId">;
};

export type ServerWallet = Account & {
  enqueueTransaction: (args: {
    transaction: PreparedTransaction;
    simulate?: boolean;
  }) => Promise<{ transactionId: string }>;
  enqueueBatchTransaction: (args: {
    transactions: PreparedTransaction[];
  }) => Promise<{ transactionId: string }>;
};

/**
 * Create a server wallet for sending transactions and signing messages via engine (v3+).
 * @param options - The server wallet options.
 * @returns An account object that can be used to send transactions and sign messages.
 * @engine
 * @example
 * ### Creating a server wallet
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const client = createThirdwebClient({
 *   secretKey: "<your-project-secret-key>",
 * });
 *
 * const myServerWallet = Engine.serverWallet({
 *   client,
 *   address: "<your-server-wallet-address>",
 *   vaultAccessToken: "<your-vault-access-token>",
 * });
 * ```
 *
 * ### Sending a transaction
 * ```ts
 * // prepare the transaction
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 *
 * // enqueue the transaction
 * const { transactionId } = await myServerWallet.enqueueTransaction({
 *   transaction,
 * });
 * ```
 *
 * ### Polling for the transaction to be submitted onchain
 * ```ts
 * // optionally poll for the transaction to be submitted onchain
 * const { transactionHash } = await Engine.waitForTransactionHash({
 *   client,
 *   transactionId,
 * });
 * console.log("Transaction sent:", transactionHash);
 * ```
 *
 *  ### Sending a batch of transactions
 * ```ts
 * // prepare the transactions
 * const transaction1 = claimTo({
 *   contract,
 *   to: firstRecipient,
 *   quantity: 1n,
 * });
 * const transaction2 = claimTo({
 *   contract,
 *   to: secondRecipient,
 *   quantity: 1n,
 * });
 *
 *
 * // enqueue the transactions in a batch
 * const { transactionId } = await myServerWallet.enqueueBatchTransaction({
 *   transactions: [transaction1, transaction2],
 * });
 * ```
 *
 * ### Polling for the batch of transactions to be submitted onchain
 * ```ts
 * // optionally poll for the transaction to be submitted onchain
 * const { transactionHash } = await Engine.waitForTransactionHash({
 *   client,
 *   transactionId,
 * });
 * console.log("Transaction sent:", transactionHash);
 * ```
 *
 * ### Getting the execution status of a transaction
 * ```ts
 * const executionResult = await Engine.getTransactionStatus({
 *   client,
 *   transactionId,
 * });
 * console.log("Transaction status:", executionResult.status);
 * ```
 */
export function serverWallet(options: ServerWalletOptions): ServerWallet {
  const { client, vaultAccessToken, address, chain, executionOptions } =
    options;
  const headers: HeadersInit = {
    "x-vault-access-token": vaultAccessToken,
  };

  const getExecutionOptions = (chainId: number): ExecutionOptions => {
    const options: ExecutionOptions | undefined = executionOptions as
      | ExecutionOptions
      | undefined;
    if (!options) {
      return {
        chainId,
        from: address,
        type: "auto",
      };
    }
    switch (options.type) {
      case "auto":
        return {
          chainId,
          from: address,
          type: "auto",
        };
      case "ERC4337":
        return {
          ...options,
          chainId,
          type: "ERC4337",
        };
    }
  };

  const enqueueTx = async (transaction: SendTransactionOption[]) => {
    if (transaction.length === 0) {
      throw new Error("No transactions to enqueue");
    }
    const firstTransaction = transaction[0];
    if (!firstTransaction) {
      throw new Error("No transactions to enqueue");
    }
    const chainId = firstTransaction.chainId;
    // Validate all transactions are on the same chain
    for (let i = 1; i < transaction.length; i++) {
      if (transaction[i]?.chainId !== chainId) {
        throw new Error(
          `All transactions in batch must be on the same chain. Expected ${chainId}, got ${transaction[i]?.chainId} at index ${i}`,
        );
      }
    }
    const body = {
      executionOptions: getExecutionOptions(chainId),
      params: transaction.map((t) => ({
        data: t.data || "0x",
        to: t.to ?? "", // TODO this should be allowed to be undefined
        value: t.value?.toString() || "0",
      })),
    };

    const result = await writeTransaction({
      baseUrl: getThirdwebBaseUrl("engineCloud"),
      body,
      bodySerializer: stringify,
      fetch: getClientFetch(client),
      headers,
    });

    if (result.error) {
      throw new Error(`Error sending transaction: ${stringify(result.error)}`);
    }

    const data = result.data?.[202];
    if (!data) {
      throw new Error("No data returned from engine");
    }
    return data.transactions.map((t) => t.id);
  };

  return {
    address,
    enqueueBatchTransaction: async (args: {
      transactions: PreparedTransaction[];
    }) => {
      const serializedTransactions: SendTransactionOption[] = [];
      for (const transaction of args.transactions) {
        const [to, data, value] = await Promise.all([
          transaction.to ? resolvePromisedValue(transaction.to) : null,
          encode(transaction),
          transaction.value ? resolvePromisedValue(transaction.value) : null,
        ]);
        serializedTransactions.push({
          chainId: transaction.chain.id,
          data,
          to: to ?? undefined,
          value: value ?? undefined,
        });
      }
      const transactionIds = await enqueueTx(serializedTransactions);
      const transactionId = transactionIds[0];
      if (!transactionId) {
        throw new Error("No transactionId returned from engine");
      }
      return { transactionId };
    },
    enqueueTransaction: async (args: {
      transaction: PreparedTransaction;
      simulate?: boolean;
    }) => {
      let serializedTransaction: SendTransactionOption;
      if (args.simulate) {
        serializedTransaction = await toSerializableTransaction({
          transaction: args.transaction,
        });
      } else {
        const [to, data, value] = await Promise.all([
          args.transaction.to
            ? resolvePromisedValue(args.transaction.to)
            : null,
          encode(args.transaction),
          args.transaction.value
            ? resolvePromisedValue(args.transaction.value)
            : null,
        ]);
        serializedTransaction = {
          chainId: args.transaction.chain.id,
          data,
          to: to ?? undefined,
          value: value ?? undefined,
        };
      }
      const transactionIds = await enqueueTx([serializedTransaction]);
      const transactionId = transactionIds[0];
      if (!transactionId) {
        throw new Error("No transactionId returned from engine");
      }
      return { transactionId };
    },
    sendBatchTransaction: async (transactions: SendTransactionOption[]) => {
      const transactionIds = await enqueueTx(transactions);
      const transactionId = transactionIds[0];
      if (!transactionId) {
        throw new Error("No transactionId returned from engine");
      }
      return waitForTransactionHash({
        client,
        transactionId,
      });
    },
    sendTransaction: async (transaction: SendTransactionOption) => {
      const transactionIds = await enqueueTx([transaction]);
      const transactionId = transactionIds[0];
      if (!transactionId) {
        throw new Error("No transactionId returned from engine");
      }
      return waitForTransactionHash({
        client,
        transactionId,
      });
    },
    signMessage: async (data) => {
      const { message, chainId } = data;
      let engineMessage: string | Hex;
      let isBytes = false;
      if (typeof message === "string") {
        engineMessage = message;
      } else {
        engineMessage = toHex(message.raw);
        isBytes = true;
      }

      const signingChainId = chainId || chain?.id;
      if (!signingChainId) {
        throw new Error("Chain ID is required for signing messages");
      }
      // FIXME
      const options = executionOptions as ExecutionOptions | undefined;
      const signResult = await signMessage({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        body: {
          params: [
            {
              format: isBytes ? "hex" : "text",
              message: engineMessage,
            },
          ],
          // FIXME
          signingOptions:
            options?.type === "ERC4337"
              ? {
                  accountSalt: options.accountSalt,
                  chainId: signingChainId,
                  entrypointAddress: options.entrypointAddress,
                  entrypointVersion: options.entrypointVersion,
                  factoryAddress: options.factoryAddress,
                  signerAddress: address,
                  smartAccountAddress: options.smartAccountAddress,
                  type: "smart_account",
                }
              : {
                  chainId: signingChainId,
                  from: address,
                  type: "eoa",
                },
        },
        bodySerializer: stringify,
        fetch: getClientFetch(client),
        headers,
      });

      if (signResult.error) {
        throw new Error(
          `Error signing message: ${stringify(signResult.error)}`,
        );
      }

      const signatureResult = signResult.data?.[200]?.result.results[0];
      if (signatureResult?.success) {
        return signatureResult.result.signature as Hex;
      }

      throw new Error(
        `Failed to sign message: ${signatureResult?.error || "Unknown error"}`,
      );
    },
    signTypedData: async (typedData) => {
      const signingChainId = chain?.id;
      if (!signingChainId) {
        throw new Error("Chain ID is required for signing messages");
      }

      const options = executionOptions as ExecutionOptions;
      const signResult = await signTypedData({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        body: {
          // biome-ignore lint/suspicious/noExplicitAny: TODO: fix ts / hey-api type clash
          params: [typedData as any],
          // FIXME
          signOptions:
            options?.type === "ERC4337"
              ? {
                  accountSalt: options.accountSalt,
                  chainId: signingChainId,
                  entrypointAddress: options.entrypointAddress,
                  entrypointVersion: options.entrypointVersion,
                  factoryAddress: options.factoryAddress,
                  signerAddress: address,
                  smartAccountAddress: options.smartAccountAddress,
                  type: "smart_account",
                }
              : {
                  chainId: signingChainId,
                  from: address,
                  type: "eoa",
                },
        },
        bodySerializer: stringify,
        fetch: getClientFetch(client),
        headers,
      });

      if (signResult.error) {
        throw new Error(
          `Error signing message: ${stringify(signResult.error)}`,
        );
      }

      const signatureResult = signResult.data?.[200]?.result.results[0];
      if (signatureResult?.success) {
        return signatureResult.result.signature as Hex;
      }

      throw new Error(
        `Failed to sign message: ${signatureResult?.error || "Unknown error"}`,
      );
    },
  };
}
