import { webLocalStorage } from "../../utils/storage/webStorage.js";
import type { Prettify } from "../../utils/type-utils.js";
import { ClientScopedStorage } from "../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { BaseLoginOptions } from "./types.js";
import { createUserWallet } from "./user.js";

export type LoginWithPasskeyOptions = Prettify<
  BaseLoginOptions & {
    action: "sign-in" | "sign-up";
    passkeyDomain?: string;
    storeLastUsedPasskey?: boolean;
  }
>;

/**
 * Login with passkey authentication
 * Authenticates users using WebAuthn passkeys for secure, passwordless login.
 * @param options - Options including action type, domain, and storage preferences
 * @returns Promise that resolves to UserWallet instance
 * @example
 * ```typescript
 * // Sign in with existing passkey
 * const userWallet = await Wallets.loginWithPasskey({
 *   client: thirdwebClient,
 *   action: "sign-in",
 *   passkeyDomain: "myapp.com",
 *   storeLastUsedPasskey: true,
 * });
 *
 * // Sign up with new passkey
 * const userWallet = await Wallets.loginWithPasskey({
 *   client: thirdwebClient,
 *   action: "sign-up",
 * });
 * ```
 * @wallet
 */
export async function loginWithPasskey(options: LoginWithPasskeyOptions) {
  const { PasskeyWebClient } = await import(
    "../../wallets/in-app/web/lib/auth/passkeys.js"
  );
  const { loginWithPasskey, registerPasskey } = await import(
    "../../wallets/in-app/core/authentication/passkeys.js"
  );

  // TODO: react native version of this
  const passkeyClient = new PasskeyWebClient();
  const storage = new ClientScopedStorage({
    clientId: options.client.clientId,
    ecosystem: options.ecosystem,
    storage: webLocalStorage,
  });

  const authResult = await (async () => {
    switch (options.action) {
      case "sign-in":
        return loginWithPasskey({
          client: options.client,
          passkeyClient,
          rp: {
            id: options.passkeyDomain ?? window.location.hostname,
            name: options.passkeyDomain ?? window.document.title,
          },
          storage: options.storeLastUsedPasskey ? storage : undefined,
          ecosystem: options.ecosystem,
        });
      case "sign-up":
        return registerPasskey({
          client: options.client,
          passkeyClient,
          rp: {
            id: options.passkeyDomain ?? window.location.hostname,
            name: options.passkeyDomain ?? window.document.title,
          },
          storage: options.storeLastUsedPasskey ? storage : undefined,
          ecosystem: options.ecosystem,
        });
    }
  })();

  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult,
  });
}
