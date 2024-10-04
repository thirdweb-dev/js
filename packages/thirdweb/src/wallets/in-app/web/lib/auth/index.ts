import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SocialAuthOption } from "../../../../../wallets/types.js";
import type {
  AuthArgsType,
  GetAuthenticatedUserParams,
  PreAuthArgsType,
  SocialAuthArgsType,
} from "../../../core/authentication/types.js";
import { getOrCreateInAppWalletConnector } from "../../../core/wallet/in-app-core.js";
import type { Ecosystem } from "../../../core/wallet/types.js";

// ---- KEEP IN SYNC WITH /wallets/in-app/native/auth/index.ts ---- //
// duplication needed for separate exports between web and native

/**
 * @internal
 */
async function getInAppWalletConnector(
  client: ThirdwebClient,
  ecosystem?: Ecosystem,
) {
  return getOrCreateInAppWalletConnector(
    client,
    async (client) => {
      const { InAppWebConnector } = await import("../web-connector.js");
      return new InAppWebConnector({
        client: client,
        ecosystem: ecosystem,
      });
    },
    ecosystem,
  );
}

/**
 * Retrieves the authenticated user for the active in-app wallet.
 * @param options - The arguments for retrieving the authenticated user.
 * @returns The authenticated user if logged in and wallet initialized, otherwise undefined.
 * @example
 * ```ts
 * import { getAuthenticatedUser } from "thirdweb/wallets/in-app";
 *
 * const user = await getAuthenticatedUser({ client });
 * if (user) {
 *  console.log(user.walletAddress);
 * }
 * ```
 * @wallet
 */
async function getAuthenticatedUser(options: GetAuthenticatedUserParams) {
  const { client, ecosystem } = options;
  const connector = await getInAppWalletConnector(client, ecosystem);
  const user = await connector.getUser();
  switch (user.status) {
    case "Logged In, Wallet Initialized": {
      return user;
    }
  }
  return undefined;
}

/**
 * Retrieves the authenticated user email for the active in-app wallet.
 * @param options - The arguments for retrieving the authenticated user.
 * @returns The authenticated user email if logged in and wallet initialized, otherwise undefined.
 * @example
 * ```ts
 * import { getUserEmail } from "thirdweb/wallets/in-app";
 *
 * const email = await getUserEmail({ client });
 * console.log(email);
 * ```
 * @wallet
 */
export async function getUserEmail(options: GetAuthenticatedUserParams) {
  const user = await getAuthenticatedUser(options);
  if (user && "email" in user.authDetails) {
    return user.authDetails.email;
  }
  return undefined;
}

/**
 * Retrieves the authenticated user phone number for the active embedded wallet.
 * @param options - The arguments for retrieving the authenticated user.
 * @returns The authenticated user phone number if authenticated with phone number, otherwise undefined.
 * @example
 * ```ts
 * import { getUserPhoneNumber } from "thirdweb/wallets/embedded";
 *
 * const phoneNumber = await getUserPhoneNumber({ client });
 * console.log(phoneNumber);
 * ```
 * @wallet
 */
export async function getUserPhoneNumber(options: GetAuthenticatedUserParams) {
  const user = await getAuthenticatedUser(options);
  if (user && "phoneNumber" in user.authDetails) {
    return user.authDetails.phoneNumber;
  }
  return undefined;
}

/**
 * Pre-authenticates the user based on the provided authentication strategy.
 * Use this function to send a verification code to the user's email or phone number.
 * @param args - The arguments required for pre-authentication.
 * @returns A promise that resolves to the pre-authentication result.
 * @throws An error if the provided authentication strategy doesn't require pre-authentication.
 * @example
 * ```ts
 * import { preAuthenticate } from "thirdweb/wallets/in-app";
 *
 * const result = await preAuthenticate({
 *  client,
 *  strategy: "email",
 *  email: "example@example.org",
 * });
 * ```
 * @wallet
 */
export async function preAuthenticate(args: PreAuthArgsType) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  return connector.preAuthenticate(args);
}

/**
 * Authenticates the user based on the provided authentication arguments.
 * @param args - The authentication arguments.
 * @returns A promise that resolves to the authentication result.
 * @example
 * ```ts
 * import { authenticate } from "thirdweb/wallets/in-app";
 *
 * const result = await authenticate({
 *  client,
 *  strategy: "email",
 *  email: "example@example.org",
 *  verificationCode: "123456",
 * });
 * ```
 * @wallet
 */
export async function authenticate(args: AuthArgsType) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  return connector.authenticate(args);
}

/**
 * Authenticates the user based on the provided authentication arguments using a redirect.
 * @param args - The authentication arguments.
 * @returns A promise that resolves to the authentication result.
 * @example
 * ```ts
 * import { authenticateWithRedirect } from "thirdweb/wallets/in-app";
 *
 * const result = await authenticateWithRedirect({
 *  client,
 *  strategy: "google",
 *  mode: "redirect",
 *  redirectUrl: "https://example.org",
 * });
 * ```
 * @wallet
 */
export async function authenticateWithRedirect(
  args: SocialAuthArgsType & { client: ThirdwebClient; ecosystem?: Ecosystem },
) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  if (!connector.authenticateWithRedirect) {
    throw new Error(
      "authenticateWithRedirect is not supported on this platform",
    );
  }
  return connector.authenticateWithRedirect(
    args.strategy as SocialAuthOption,
    args.mode,
    args.redirectUrl,
  );
}

/**
 * Connects a new profile (and new authentication method) to the current user.
 *
 * Requires a connected in-app or ecosystem account.
 *
 * **When a profile is linked to the account, that profile can then be used to sign into the same account.**
 *
 * @param auth - The authentications options to add the new profile.
 * @returns A promise that resolves to the currently linked profiles when the connection is successful.
 * @throws If the connection fails, if the profile is already linked to the account, or if the profile is already associated with another account.
 *
 * @example
 * ```ts
 * import { linkProfile } from "thirdweb/wallets";
 *
 * await linkProfile({ client, strategy: "discord" });
 * ```
 * @wallet
 */
export async function linkProfile(args: AuthArgsType) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  return await connector.linkProfile(args);
}

/**
 * Gets the linked profiles for the connected in-app or ecosystem wallet.
 *
 * @returns An array of accounts user profiles linked to the connected wallet.
 *
 * @example
 * ```ts
 * import { getProfiles } from "thirdweb/wallets";
 *
 * const profiles = await getProfiles({
 *  client,
 * });
 *
 * console.log(profiles[0].type); // will be "email", "phone", "google", "discord", etc
 * console.log(profiles[0].details.email);
 * console.log(profiles[0].details.phone);
 * ```
 *
 * ### Getting profiles for a ecosystem user
 *
 * ```ts
 * import { getProfiles } from "thirdweb/wallets/in-app";
 *
 * const profiles = await getProfiles({
 *  client,
 *  ecosystem: {
 *    id: "ecosystem.your-ecosystem-id",
 *  },
 * });
 * ```
 * @wallet
 */
export async function getProfiles(args: GetAuthenticatedUserParams) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  return connector.getProfiles();
}
