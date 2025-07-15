import { webLocalStorage } from "../../utils/storage/webStorage.js";
import { ClientScopedStorage } from "../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { BaseLoginOptions } from "./types.js";
import { createUserWallet } from "./user.js";

/**
 * Login as a guest
 * @param options - Options including the client and ecosystem
 * @returns Promise that resolves to the user wallet
 * @example
 * ```typescript
 * import { Wallets } from "thirdweb/v2";
 *
 * const userWallet = await Wallets.loginAsGuest({
 *   client: thirdwebClient,
 * });
 * ```
 */
export async function loginAsGuest(options: BaseLoginOptions) {
  const { guestAuthenticate } = await import(
    "../../wallets/in-app/core/authentication/guest.js"
  );
  const storage = new ClientScopedStorage({
    clientId: options.client.clientId,
    ecosystem: options.ecosystem,
    storage: webLocalStorage,
  });
  const authResult = await guestAuthenticate({
    client: options.client,
    storage,
    ecosystem: options.ecosystem,
  });

  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult,
  });
}
