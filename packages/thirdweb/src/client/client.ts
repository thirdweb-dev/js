import { computeClientIdFromSecretKey } from "../utils/client-id.js";

export type CreateClientOptions =
  | {
      clientId: string;
      secretKey?: never;
    }
  | {
      clientId?: never;
      secretKey: string;
    };

export type ThirdwebClient = {
  readonly clientId: string;
  readonly secretKey: string | undefined;
};

/**
 * Creates a Thirdweb client with the provided options.
 * @param options - The options for creating the client.
 * @returns The created Thirdweb client.
 * @throws An error if neither `clientId` nor `secretKey` is provided.
 * @example
 * ```ts
 * import { createClient } from "thirdweb";
 * const client = createClient({ clientId: "..." });
 * ```
 */
export function createClient(options: CreateClientOptions): ThirdwebClient {
  // if secretKey is provided, compute the clientId from it (and ignore any clientId passed in)
  if (options.secretKey) {
    return {
      clientId: computeClientIdFromSecretKey(options.secretKey),
      secretKey: options.secretKey,
    } as const;
  }
  // otherwise if clientId is provided, use it
  if (options.clientId) {
    return {
      clientId: options.clientId,
      secretKey: undefined,
    } as const;
  }

  // otherwise throw an error
  throw new Error("clientId or secretKey must be provided");
}
