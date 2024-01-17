import { type RpcClientOptions, getRpcClient } from "../rpc/index.js";
import { computeClientIdFromSecretKey } from "../utils/client-id.js";

export type CreateThirdwebClientOptions =
  | {
      clientId: string;
      secretKey?: never;
    }
  | {
      clientId?: never;
      secretKey: string;
    };

/**
 * @internal
 */
export type RawClient = {
  clientId: Readonly<string>;
  secretKey: Readonly<string | undefined>;
};

export type ThirdwebClient = RawClient & {
  rpc: (options: RpcClientOptions) => ReturnType<typeof getRpcClient>;
};

export function createThirdwebClient(
  options: CreateThirdwebClientOptions,
): ThirdwebClient {
  let rawClient: RawClient;
  if (options.secretKey) {
    rawClient = {
      clientId: computeClientIdFromSecretKey(options.secretKey),
      secretKey: options.secretKey,
    } as const;
  } else if (options.clientId) {
    rawClient = {
      clientId: options.clientId,
      secretKey: undefined,
    } as const;
  } else {
    throw new Error("clientId or secretKey must be provided");
  }

  // freeze the client
  return Object.freeze({
    ...rawClient,
    rpc: (rpcOptions: RpcClientOptions) => getRpcClient(rawClient, rpcOptions),
  });
}
