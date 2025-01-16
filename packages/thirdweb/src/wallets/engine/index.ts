import type { Chain } from "../../chains/types.js";
import type { Hex } from "../../utils/encoding/hex.js";
import { toHex } from "../../utils/encoding/hex.js";
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";

/**
 * Options for creating an engine account.
 */
export type EngineAccountOptions = {
  /**
   * The URL of your engine instance.
   */
  engineUrl: string;
  /**
   * The auth token to use with the engine instance.
   */
  authToken: string;
  /**
   * The backend wallet to use for sending transactions inside engine.
   */
  walletAddress: string;
  /**
   * The chain to use for signing messages and typed data (smart backend wallet only).
   */
  chain?: Chain;
};

/**
 * Creates an account that uses your engine backend wallet for sending transactions and signing messages.
 *
 * @param options - The options for the engine account.
 * @returns An account that uses your engine backend wallet.
 *
 * @beta
 * @wallet
 *
 * @example
 * ```ts
 * import { engineAccount } from "thirdweb/wallets/engine";
 *
 * const engineAcc = engineAccount({
 *   engineUrl: "https://engine.thirdweb.com",
 *   authToken: "your-auth-token",
 *   walletAddress: "0x...",
 * });
 *
 * // then use the account as you would any other account
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 * const result = await sendTransaction({ transaction, account: engineAcc });
 * console.log("Transaction sent:", result.transactionHash);
 * ```
 */
export function engineAccount(options: EngineAccountOptions): Account {
  const { engineUrl, authToken, walletAddress, chain } = options;

  // these are shared across all methods
  const headers: HeadersInit = {
    "x-backend-wallet-address": walletAddress,
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return {
    address: walletAddress,
    sendTransaction: async (transaction: SendTransactionOption) => {
      const ENGINE_URL = new URL(engineUrl);
      ENGINE_URL.pathname = `/backend-wallet/${transaction.chainId}/send-transaction`;

      const engineData: Record<string, string | undefined> = {
        // add to address if we have it (is optional to pass to engine)
        toAddress: transaction.to || undefined,
        // engine wants a hex string here so we serialize it
        data: transaction.data || "0x",
        // value is always required
        value: toHex(transaction.value ?? 0n),
      };

      // TODO: gas overrides etc?

      const engineRes = await fetch(ENGINE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(engineData),
      });
      if (!engineRes.ok) {
        const body = await engineRes.text();
        throw new Error(
          `Engine request failed with status ${engineRes.status} - ${body}`,
        );
      }
      const engineJson = (await engineRes.json()) as {
        result: {
          queueId: string;
        };
      };

      // wait for the queueId to be processed
      ENGINE_URL.pathname = `/transaction/status/${engineJson.result.queueId}`;
      const startTime = Date.now();
      const TIMEOUT_IN_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

      while (Date.now() - startTime < TIMEOUT_IN_MS) {
        const queueRes = await fetch(ENGINE_URL, {
          method: "GET",
          headers,
        });
        if (!queueRes.ok) {
          const body = await queueRes.text();
          throw new Error(
            `Engine request failed with status ${queueRes.status} - ${body}`,
          );
        }
        const queueJSON = (await queueRes.json()) as {
          result: {
            status: "queued" | "mined" | "cancelled" | "errored";
            transactionHash: Hex | null;
            userOpHash: Hex | null;
            errorMessage: string | null;
          };
        };

        if (
          queueJSON.result.status === "errored" &&
          queueJSON.result.errorMessage
        ) {
          throw new Error(queueJSON.result.errorMessage);
        }
        if (queueJSON.result.transactionHash) {
          return {
            transactionHash: queueJSON.result.transactionHash,
          };
        }
        // wait 1s before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      throw new Error("Transaction timed out after 5 minutes");
    },
    signMessage: async ({ message }) => {
      let engineMessage: string | Hex;
      let isBytes = false;
      if (typeof message === "string") {
        engineMessage = message;
      } else {
        engineMessage = toHex(message.raw);
        isBytes = true;
      }

      const ENGINE_URL = new URL(engineUrl);
      ENGINE_URL.pathname = "/backend-wallet/sign-message";
      const engineRes = await fetch(ENGINE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: engineMessage,
          isBytes,
          chainId: chain?.id,
        }),
      });
      if (!engineRes.ok) {
        const body = await engineRes.text();
        throw new Error(
          `Engine request failed with status ${engineRes.status} - ${body}`,
        );
      }
      const engineJson = (await engineRes.json()) as {
        result: Hex;
      };
      return engineJson.result;
    },
    signTypedData: async (_typedData) => {
      const ENGINE_URL = new URL(engineUrl);
      ENGINE_URL.pathname = "/backend-wallet/sign-typed-data";
      const engineRes = await fetch(ENGINE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          domain: _typedData.domain,
          types: _typedData.types,
          value: _typedData.message,
        }),
      });
      if (!engineRes.ok) {
        engineRes.body?.cancel();
        throw new Error(
          `Engine request failed with status ${engineRes.status}`,
        );
      }
      const engineJson = (await engineRes.json()) as {
        result: Hex;
      };
      return engineJson.result;
    },
  };
}
