import { createThirdwebClient } from "../../client/client.js";

/**
 * Initializes a new Thirdweb client using your client ID or secret key.
 * @param options - Options for initializing the client
 * @param options.clientId - The client ID for your Thirdweb project
 * @param options.secretKey - The secret key for your Thirdweb project
 * @returns A new Thirdweb client instance to be used with other thirdweb functions
 *
 * @example
 * ## Initialize client-side
 * ```typescript
 * import { Client } from "thirdweb/v2";
 *
 * const thirdwebClient = Client.init({
 *   clientId: "YOUR_CLIENT_ID",
 * });
 * ```
 *
 * ## Initialize server-side
 * ```typescript
 * import { createThirdwebClient } from "thirdweb/v2";
 *
 * const thirdwebClient = createThirdwebClient({
 *   secretKey: "YOUR_CLIENT_ID",
 * });
 * ```
 */
export function init(options: init.Options) {
  return createThirdwebClient(options);
}

export declare namespace init {
  type Options = {
    clientId: string;
    secretKey?: string;
  } | {
    clientId?: string;
    secretKey: string;
  };
}
