import type { Prettify } from "../../utils/type-utils.js";
import type { SocialAuthOption } from "../../wallets/types.js";
import type { BaseLoginOptions, UserWallet } from "./types.js";
import { createUserWallet } from "./user.js";

export type LoginWithOauthOptions = Prettify<
  BaseLoginOptions & {
    provider: SocialAuthOption;
  }
>;

/**
 * Login with OAuth provider
 * Authenticate a user using OAuth providers like Google, Facebook, Apple, etc.
 * @param options - Login options including provider and client configuration
 * @returns Promise that resolves to UserWallet instance
 * @example
 * ```typescript
 * const userWallet = await Wallets.loginWithOauth({
 *   client: thirdwebClient,
 *   provider: "google",
 * });
 * ```
 * @wallet
 */
export async function loginWithOauth(
  options: LoginWithOauthOptions,
): Promise<UserWallet> {
  const { loginWithOauth } = await import(
    "../../wallets/in-app/web/lib/auth/oauth.js"
  );
  const authResult = await loginWithOauth({
    authOption: options.provider,
    client: options.client,
    ecosystem: options.ecosystem,
  });
  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult,
  });
}

export type LoginWithOauthRedirectOptions = Prettify<
  LoginWithOauthOptions & {
    redirectUrl?: string;
  }
>;

/**
 * Initiate OAuth login with redirect
 * Redirects the user to the OAuth provider's login page for authentication.
 * @param options - Login options including provider, client, and optional redirect URL
 * @returns Promise that resolves when redirect is initiated
 * @example
 * ```typescript
 * await Wallets.loginWithOauthRedirect({
 *   client: thirdwebClient,
 *   provider: "google",
 *   redirectUrl: "https://myapp.com/callback",
 * });
 * ```
 * @wallet
 */
export async function loginWithOauthRedirect(
  options: LoginWithOauthRedirectOptions,
): Promise<void> {
  const { loginWithOauthRedirect } = await import(
    "../../wallets/in-app/web/lib/auth/oauth.js"
  );
  return loginWithOauthRedirect({
    authOption: options.provider,
    client: options.client,
    redirectUrl: options.redirectUrl,
    ecosystem: options.ecosystem,
  });
}

/**
 * Handle OAuth redirect callback
 * Processes the OAuth redirect response and creates a user wallet from the authentication token.
 * @param options - Base login options with client and ecosystem configuration
 * @returns Promise that resolves to UserWallet instance
 * @example
 * ```typescript
 * // After OAuth redirect callback
 * const userWallet = await Wallets.handleOauthRedirect({
 *   client: thirdwebClient,
 * });
 * ```
 * @wallet
 */
export async function handleOauthRedirect(
  options: BaseLoginOptions,
): Promise<UserWallet> {
  const { getUrlToken } = await import(
    "../../wallets/in-app/web/lib/get-url-token.js"
  );
  const urlToken = getUrlToken();
  if (!urlToken?.authResult) {
    throw new Error("No auth token found in URL");
  }
  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult: urlToken.authResult,
  });
}
