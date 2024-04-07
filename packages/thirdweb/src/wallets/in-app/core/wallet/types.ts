import type { ThirdwebClient } from "../../../../client/client.js";
import type { AsyncStorage } from "../../../storage/AsyncStorage.js";

export type InAppWalletCreationOptions = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;
  /**
   * Storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to save connected wallet data to the storage for auto-connect.
   * If not provided, no wallet data will be saved to the storage by thirdweb SDK
   */
  storage?: AsyncStorage;
};

export type AuthenticatedUser = {
  email: string | undefined;
  walletAddress: string;
};
