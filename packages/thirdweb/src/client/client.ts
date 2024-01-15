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

export type ThirdwebClient = {
  clientId: Readonly<string>;
  secretKey: Readonly<string | undefined>;
};

export function createThirdwebClient(
  options: CreateThirdwebClientOptions,
): ThirdwebClient {
  if (options.secretKey) {
    return {
      clientId: computeClientIdFromSecretKey(options.secretKey),
      secretKey: options.secretKey,
    } as const;
  }
  if (options.clientId) {
    return {
      clientId: options.clientId,
      secretKey: undefined,
    } as const;
  }
  throw new Error("clientId or secretKey must be provided");
}
