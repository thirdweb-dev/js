import { computeClientIdFromSecretKey } from "../utils/client-id.js";
import { isJWT } from "../utils/jwt/is-jwt.js";
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

  /**
   * The team ID for thirdweb dashboard usage.
   * @hidden
   */
  teamId?: string;
}>;

export type CreateThirdwebClientOptions = Prettify<
  (
    | {
        clientId: string;
        secretKey?: string;
      }
    | {
        clientId?: string;
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
 * Get your client ID and secret key from the Thirdweb dashboard [here](https://thirdweb.com/create-api-key).
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
 * @client
 */
export function createThirdwebClient(
  options: CreateThirdwebClientOptions,
): ThirdwebClient {
  const { clientId, secretKey, ...rest } = options;

  let realClientId: string | undefined = clientId;

  if (secretKey) {
    if (isJWT(secretKey)) {
      // when passing a JWT as secret key we HAVE to also have a clientId
      if (!clientId) {
        throw new Error("clientId must be provided when using a JWT secretKey");
      }
    } else {
      // always PREFER the clientId if provided, only compute it from the secretKey if we don't have a clientId passed explicitly
      realClientId = clientId ?? computeClientIdFromSecretKey(secretKey);
    }
  }

  // only path we get here is if we have no secretKey and no clientId
  if (!realClientId) {
    throw new Error("clientId or secretKey must be provided");
  }

  return {
    ...rest,
    clientId: realClientId,
    secretKey,
  } as const;
}
