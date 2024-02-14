import { computeClientIdFromSecretKey } from "../utils/client-id.js";

type ClientOptions = {
  fetchTimeout?:
    | number
    | {
        storage?: number;
        rpc?: number;
      };
};

export type CreateThirdwebClientOptions = (
  | {
      clientId: string;
      secretKey?: never;
    }
  | {
      clientId?: never;
      secretKey: string;
    }
) &
  ClientOptions;

export type ThirdwebClient = {
  readonly clientId: string;
  readonly secretKey: string | undefined;
} & Readonly<ClientOptions>;

/**
 * Creates a Thirdweb client with the provided options.
 * @param options - The options for creating the client.
 * @returns The created Thirdweb client.
 * @throws An error if neither `clientId` nor `secretKey` is provided.
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * const client = createThirdwebClient({ clientId: "..." });
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

// TODO: can this be lower?
const DEFAULT_FETCH_TIMEOUT = 60000;

/**
 * Retrieves the request timeout configuration for the specified client and type.
 * If the client does not have a specific timeout configuration for the given type,
 * the fallback timeout value is returned.
 *
 * @param client - The ThirdwebClient instance.
 * @param type - The type of request (storage or rpc).
 * @param fallback - The fallback timeout value (default: DEFAULT_FETCH_TIMEOUT).
 * @returns The request timeout configuration.
 * @internal
 */
export function getRequestTimeoutConfig(
  client: ThirdwebClient,
  type: "storage" | "rpc",
  fallback = DEFAULT_FETCH_TIMEOUT,
): number {
  const timeout = client.fetchTimeout;
  if (!timeout) {
    return fallback;
  }
  if (typeof timeout === "number") {
    return timeout;
  }
  const specificTimeout = timeout[type];
  if (specificTimeout) {
    return specificTimeout;
  }
  return fallback;
}
