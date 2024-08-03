import type {
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import { serializeTransaction } from "../transaction/serialize-transaction.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import type { Account } from "./interfaces/wallet.js";

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
};

/**
 * @internal - for now
 *
 * Creates an engine account with the specified options.
 *
 * @param options - The options for the engine account.
 * @returns An account object with methods for sending transactions, signing messages, and signing typed data.
 */
export function engineAccount(options: EngineAccountOptions): Account {
  const { engineUrl, authToken, walletAddress } = options;

  // these are shared across all methods
  const headers: HeadersInit = {
    "x-backend-wallet-address": walletAddress,
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return {
    address: walletAddress,
    sendTransaction: async (
      transaction: TransactionSerializable & { chainId: number },
    ) => {
      // this will be the baseline URL for the requests
      const ENGINE_URL = new URL(engineUrl);

      const engineData: Record<string, string> = {
        // engine wants a hex string here so we serialize it
        data: serializeTransaction({ transaction }),
        // value is always required
        value: toHex(transaction.value ?? 0n),
      };
      // add to address if we have it (is optional to pass to engine)
      if (transaction.to) {
        engineData.toAddress = transaction.to;
      }
      // TODO: gas overrides etc?

      // set the pathname correctly
      // see: https://redocly.github.io/redoc/?url=https://demo.web3api.thirdweb.com/json#tag/Backend-Wallet/operation/sendTransaction
      ENGINE_URL.pathname = `/backend-wallet/${transaction.chainId}/send-transaction`;
      const engineRes = await fetch(ENGINE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(engineData),
      });
      if (!engineRes.ok) {
        engineRes.body?.cancel();
        throw new Error(
          `Engine request failed with status ${engineRes.status}`,
        );
      }
      const engineJson = (await engineRes.json()) as {
        result: {
          queueId: string;
        };
      };

      // wait for the queueId to be processed
      ENGINE_URL.pathname = `/transaction/status/${engineJson.result.queueId}`;
      while (true) {
        const queueRes = await fetch(ENGINE_URL, {
          method: "GET",
          headers,
        });
        if (!queueRes.ok) {
          queueRes.body?.cancel();
          throw new Error(
            `Engine request failed with status ${queueRes.status}`,
          );
        }
        const queueJSON = (await queueRes.json()) as {
          result: {
            transactionHash: Hex | null;
          };
        };
        if (queueJSON.result.transactionHash) {
          return {
            transactionHash: queueJSON.result.transactionHash,
          };
        }
        // arbitrary time right now
        // wait 1s before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
    signMessage: async ({ message }: { message: SignableMessage }) => {
      let engineMesasage: string | Hex;
      let isBytes = false;
      if (typeof message === "string") {
        engineMesasage = message;
      } else {
        engineMesasage = toHex(message.raw);
        isBytes = true;
      }

      // this will be the baseline URL for the requests
      const ENGINE_URL = new URL(engineUrl);
      // set the pathname correctly
      // see: https://redocly.github.io/redoc/?url=https://demo.web3api.thirdweb.com/json#tag/Backend-Wallet/operation/signMessage
      ENGINE_URL.pathname = "/backend-wallet/sign-message";
      const engineRes = await fetch(ENGINE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: engineMesasage,
          isBytes,
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
    signTypedData: async <
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(
      _typedData: TypedDataDefinition<typedData, primaryType>,
    ) => {
      // this will be the baseline URL for the requests
      const ENGINE_URL = new URL(engineUrl);
      // set the pathname correctly
      // see:  https://redocly.github.io/redoc/?url=https://demo.web3api.thirdweb.com/json#tag/Backend-Wallet/operation/signTypedData
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
