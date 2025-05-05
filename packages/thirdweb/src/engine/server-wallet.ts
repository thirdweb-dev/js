import {
  type AaExecutionOptions,
  type AaZksyncExecutionOptions,
  searchTransactions,
  sendTransaction,
  signMessage,
  signTypedData,
} from "@thirdweb-dev/engine";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import type {
  Account,
  SendTransactionOption,
} from "../wallets/interfaces/wallet.js";

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

type RevertDataSerialized = {
  revertReason?: string;
  decodedError?: {
    name: string;
    signature: string;
    args: string[];
  };
};

type ExecutionResult =
  | {
      status: "QUEUED";
    }
  | {
      status: "FAILED";
      error: string;
    }
  | {
      status: "SUBMITTED";
      monitoringStatus: "WILL_MONITOR" | "CANNOT_MONITOR";
      userOpHash: string;
    }
  | ({
      status: "CONFIRMED";
      userOpHash: Hex;
      transactionHash: Hex;
      actualGasCost: string;
      actualGasUsed: string;
      nonce: string;
    } & (
      | {
          onchainStatus: "SUCCESS";
        }
      | {
          onchainStatus: "REVERTED";
          revertData?: RevertDataSerialized;
        }
    ));

/**
 * Create a server wallet for sending transactions and signing messages via engine (v3+).
 * @param options - The server wallet options.
 * @returns An account object that can be used to send transactions and sign messages.
 * @engine
 * @example
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const myServerWallet = Engine.serverWallet({
 *   client,
 *   vaultAccessToken,
 *   walletAddress,
 * });
 *
 * // then use the account as you would any other account
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 * const result = await sendTransaction({
 *   transaction,
 *   account: myServerWallet
 * });
 * console.log("Transaction sent:", result.transactionHash);
 * ```
 */
export function serverWallet(options: ServerWalletOptions): Account {
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

  return {
    address,
    sendTransaction: async (transaction: SendTransactionOption) => {
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

      // wait for the queueId to be processed
      const startTime = Date.now();
      const TIMEOUT_IN_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

      while (Date.now() - startTime < TIMEOUT_IN_MS) {
        const searchResult = await searchTransactions({
          baseUrl: getThirdwebBaseUrl("engineCloud"),
          fetch: getClientFetch(client),
          body: {
            filters: [
              {
                field: "id",
                values: [transactionId],
                operation: "OR",
              },
            ],
          },
        });

        if (searchResult.error) {
          throw new Error(
            `Error searching for transaction: ${stringify(searchResult.error)}`,
          );
        }

        const data = searchResult.data?.result?.transactions?.[0];

        if (!data) {
          throw new Error(`Transaction ${transactionId} not found`);
        }

        const executionResult = data.executionResult as ExecutionResult;
        const status = executionResult.status;

        if (status === "FAILED") {
          throw new Error(
            `Transaction failed: ${executionResult.error || "Unknown error"}`,
          );
        }

        const onchainStatus =
          executionResult && "onchainStatus" in executionResult
            ? executionResult.onchainStatus
            : null;

        if (status === "CONFIRMED" && onchainStatus === "REVERTED") {
          const revertData =
            "revertData" in executionResult
              ? executionResult.revertData
              : undefined;
          throw new Error(
            `Transaction reverted: ${revertData?.decodedError?.name || revertData?.revertReason || "Unknown revert reason"}`,
          );
        }

        if (data.transactionHash) {
          return {
            transactionHash: data.transactionHash as Hex,
          };
        }
        // wait 1s before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      throw new Error("Transaction timed out after 5 minutes");
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
