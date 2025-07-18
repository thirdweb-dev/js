import { sendTransactions } from "@thirdweb-dev/api";
import type { UserWallet } from "../wallets/types.js";
import type { TransactionRequest } from "./types.js";
import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";

/**
 * Sends a series of transactions for execution. Each transaction can be a human-readable contract call, native transfer, or encoded transaction.
 *
 * @param options - Options including the wallet, chain id, and transactions
 * @param options.wallet - The wallet to use for signing transactions
 * @param options.chainId - The chain ID to use for the transactions
 * @param options.transactions - An array of transactions to send
 * @returns The sent transaction IDs
 * @example
 *
 * ## Call a contract
 * ```typescript
 * import { Client, Transactions, Wallets } from "thirdweb/v2";
 *
 * const userWallet = await Wallets.loginWithOauth({
 *   client: thirdwebClient,
 *   provider: "google",
 * });
 *
 * const transactionIds = await Transactions.send({
 *   wallet: userWallet,
 *   chainId: 1,
 *   transactions: [
 *     {
 *       contractAddress: "0x...",
 *       method: "function transfer(address,uint256)",
 *       params: ["0x...", 100n],
 *     }
 *   ],
 * });
 * ```
 *
 * ## Send native currency
 * ```typescript
 * import { Client, Transactions, Wallets } from "thirdweb/v2";
 *
 * const userWallet = await Wallets.loginAsGuest({
 *   client: thirdwebClient,
 * });
 *
 * const transactionIds = await Transactions.send({
 *   wallet: userWallet,
 *   chainId: 1,
 *   transactions: [
 *     {
 *       to: "0x...",
 *       value: 100n,
 *     }
 *   ],
 * });
 * ```
 *
 * ## Send an encoded transaction
 * ```typescript
 * import { Client, Transactions, Wallets } from "thirdweb/v2";
 *
 * const thirdwebClient = Client.init({
 *   clientId: "YOUR_CLIENT_ID",
 * });
 *
 * const userWallet = await Wallets.loginWithOauth({
 *   client: thirdwebClient,
 *   provider: "github",
 * });
 *
 * const transactionIds = await Transactions.send({
 *   wallet: userWallet,
 *   chainId: 1,
 *   transactions: [
 *     {
 *       to: "0x...",
 *       data: "0x...",
 *     }
 *   ],
 * });
 */
export async function send(options: send.Options): Promise<Array<string>> {
  const transactions = options.transactions.map((transaction) => {
    if ("contractAddress" in transaction) {
      return {
        contractAddress: transaction.contractAddress,
        method: transaction.method,
        params: transaction.params,
        value: transaction.value?.toString() ?? "0",
        type: "contract-call" as const,
      } as const;
    } else if ("data" in transaction) {
      return {
        to: transaction.to,
        data: transaction.data,
        value: transaction.value?.toString() ?? "0",
        type: "encoded" as const,
      } as const;
    } else {
      return {
        to: transaction.to,
        value: transaction.value?.toString() ?? "0",
        type: "native-transfer" as const,
      } as const;
    }
  });

  const result = await sendTransactions({
    baseUrl: getThirdwebBaseUrl("api"),
    fetch: getClientFetch(options.wallet.client),
    headers: {
      Authorization: `Bearer ${options.wallet.authToken}`,
    },
    body: {
      chainId: options.chainId,
      from: options.wallet.address,
      transactions
    }
  });

  if (result.error) {
    throw new Error(
      `Failed to send transactions: ${result.response.status} - ${result.error}`,
    );
  }
  const transactionIds = result.data?.result?.transactionIds;
  if (!transactionIds) {
    throw new Error("Failed to send transactions: no transaction ids");
  }
  return transactionIds;
};

export namespace send {
  export type Options = {
    wallet: UserWallet;
    chainId: number;
    transactions: Array<TransactionRequest>;
  };
}

