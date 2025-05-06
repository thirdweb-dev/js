import {
  type AaExecutionOptions,
  type AaZksyncExecutionOptions,
  sendTransaction,
  signMessage,
  signTypedData,
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
import { waitForTransactionHash } from "./get-status.js";

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
  executionOptions?:
    | Omit<AaExecutionOptions, "chainId">
    | Omit<AaZksyncExecutionOptions, "chainId">;
};

export type ServerWallet = Account & {
  enqueueTransaction: (args: {
    transaction: PreparedTransaction;
    simulate?: boolean;
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

  const getExecutionOptions = (chainId: number) => {
    return executionOptions
      ? {
          ...executionOptions,
          chainId: chainId.toString(),
        }
      : {
          from: address,
          chainId: chainId.toString(),
        };
  };

  const enqueueTx = async (transaction: SendTransactionOption) => {
    const body = {
      executionOptions: getExecutionOptions(transaction.chainId),
      params: [
        {
          to: transaction.to ?? undefined,
          data: transaction.data,
          value: transaction.value?.toString(),
        },
      ],
    };

    const result = await sendTransaction({
      baseUrl: getThirdwebBaseUrl("engineCloud"),
      fetch: getClientFetch(client),
      headers,
      body,
    });

    if (result.error) {
      throw new Error(`Error sending transaction: ${result.error}`);
    }

    const data = result.data?.result;
    if (!data) {
      throw new Error("No data returned from engine");
    }
    const transactionId = data.transactions?.[0]?.id;
    if (!transactionId) {
      throw new Error("No transactionId returned from engine");
    }
    return transactionId;
  };

  return {
    address,
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
      const transactionId = await enqueueTx(serializedTransaction);
      return { transactionId };
    },
    sendTransaction: async (transaction: SendTransactionOption) => {
      const transactionId = await enqueueTx(transaction);
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

      const signResult = await signMessage({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        fetch: getClientFetch(client),
        headers,
        body: {
          executionOptions: getExecutionOptions(signingChainId),
          params: [
            {
              message: engineMessage,
              messageFormat: isBytes ? "hex" : "text",
            },
          ],
        },
      });

      if (signResult.error) {
        throw new Error(
          `Error signing message: ${stringify(signResult.error)}`,
        );
      }

      const signatureResult = signResult.data?.result.results[0];
      if (signatureResult?.success) {
        return signatureResult.result.signature as Hex;
      }

      throw new Error(
        `Failed to sign message: ${signatureResult?.error?.message || "Unknown error"}`,
      );
    },
    signTypedData: async (typedData) => {
      const signingChainId = chain?.id;
      if (!signingChainId) {
        throw new Error("Chain ID is required for signing messages");
      }

      const signResult = await signTypedData({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        fetch: getClientFetch(client),
        headers,
        body: {
          executionOptions: getExecutionOptions(signingChainId),
          // biome-ignore lint/suspicious/noExplicitAny: TODO: fix ts / hey-api type clash
          params: [typedData as any],
        },
      });

      if (signResult.error) {
        throw new Error(
          `Error signing message: ${stringify(signResult.error)}`,
        );
      }

      const signatureResult = signResult.data?.result.results[0];
      if (signatureResult?.success) {
        return signatureResult.result.signature as Hex;
      }

      throw new Error(
        `Failed to sign message: ${signatureResult?.error?.message || "Unknown error"}`,
      );
    },
  };
}
