import type { ThirdwebClient } from "../../../../../client/client.js";
import type { OneOf } from "../../../../../utils/type-utils.js";
import type { SocialAuthOption } from "../../../../../wallets/types.js";
import {
  type AuthArgsType,
  type GetAuthenticatedUserParams,
  type PreAuthArgsType,
  UserWalletStatus,
} from "../../../core/authentication/types.js";
import { getOrCreateInAppWalletConnector } from "../../../core/wallet/in-app-core.js";
import type { Ecosystem } from "../../types.js";

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
export async function getAuthenticatedUser(
  options: GetAuthenticatedUserParams,
) {
  const { client } = options;
  const connector = await getInAppWalletConnector(client);
  const user = await connector.getUser();
  switch (user.status) {
    case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
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
export async function authenticate(
  args: OneOf<
    | AuthArgsType
    | {
        strategy: SocialAuthOption;
        client: ThirdwebClient;
        ecosystem?: Ecosystem;
        redirect: boolean;
      }
  >,
) {
  const connector = await getInAppWalletConnector(args.client, args.ecosystem);
  const isRedirect = args.redirect || args.mode !== "popup";
  if (isRedirect && connector.authenticateWithRedirect && args.strategy)
    return connector.authenticateWithRedirect(
      args.strategy as SocialAuthOption,
      args.mode,
      args.redirectUrl,
    );
  return connector.connect(args);
}
