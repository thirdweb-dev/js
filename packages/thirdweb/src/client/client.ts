import { computeClientIdFromSecretKey } from "../utils/client-id.js";
import type { Prettify } from "../utils/type-utils.js";

type FetchConfig = {
  requestTimeoutMs?: number;
  keepalive?: boolean;
  headers?: HeadersInit;
};

type ClientOptions = Prettify<{
  /**
   * The configuration options for the client.
   */
  config?: {
    /**
     * The configuration options for the RPC client.
     */
    rpc?: {
      /**
       * The configuration options for the fetch function.
       * @default {}
       */
      fetch?: FetchConfig;
      /**
       * The maximum number of requests to batch together.
       * @default 100
       */
      maxBatchSize?: number;
      /**
       * The maximum time to wait before sending a batch of requests.
       * @default 0 (no timeout)
       */
      batchTimeoutMs?: number;
    };
    /**
     * The configuration options for the storage client.
     */
    storage?: {
      /**
       * The configuration options for the fetch function.
       * @default {}
       */
      fetch?: FetchConfig;
      /**
       * The IPFS gateway URL.
       * @default "https://<your_client_id>.ipfscdn.io/ipfs/<cid>"
       */
      gatewayUrl?: string;
    };
  };
}>;

export type CreateThirdwebClientOptions = Prettify<
  (
    | {
        clientId: string;
        secretKey?: never;
      }
    | {
        clientId?: never;
        secretKey: string;
      }
  ) &
    ClientOptions
>;

export type ThirdwebClient = {
  readonly clientId: string;
  readonly secretKey: string | undefined;
} & Readonly<ClientOptions>;

/**
 * Creates a Thirdweb client using the provided client ID (client-side) or secret key (server-side).
 *
 * Get your client ID and secret key from the Thirdweb dashboard [here](https://thirdweb.com/dashboard/settings/api-keys).
 * **Never share your secret key with anyone.
 *
 * A client is necessary for most functions in the thirdweb SDK. It provides access to thirdweb APIs including built-in RPC, storage, and more.
 *
 * @param options - The options for creating the client.
 * @param [options.clientId] - The client ID to use for thirdweb services.
 * @param [options.secretKey] - The secret key to use for thirdweb services.
 * @returns The created Thirdweb client.
 * @throws An error if neither `clientId` nor `secretKey` is provided.
 *
 * @example
 * Create a client on the client side (client ID):
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * ```
 *
 * Create a client on the server (secret key):
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 *
 * const client = createThirdwebClient({ secretKey: "..." });
 * ```
 */
export function createThirdwebClient(
  options: CreateThirdwebClientOptions,
): ThirdwebClient {
  const { clientId, secretKey, ...rest } = options;
  // if secretKey is provided, compute the clientId from it (and ignore any clientId passed in)
  if (secretKey) {
    return {
      ...rest,
      clientId: computeClientIdFromSecretKey(secretKey),
      secretKey,
    } as const;
  }
  // otherwise if clientId is provided, use it
  if (clientId) {
    return {
      ...rest,
      clientId: options.clientId,
      secretKey: undefined,
    } as const;
  }

  // otherwise throw an error
  throw new Error("clientId or secretKey must be provided");
}
