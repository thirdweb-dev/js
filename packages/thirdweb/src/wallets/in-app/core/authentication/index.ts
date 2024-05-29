import type { ThirdwebClient } from "../../../../client/client.js";
import { isBrowser, isReactNative } from "../../../../utils/platform.js";
import type { InAppConnector } from "../interfaces/connector.js";
import {
  type AuthArgsType,
  type AuthLoginReturnType,
  AuthProvider,
  type PreAuthArgsType,
  UserWalletStatus,
} from "./type.js";

export type GetAuthenticatedUserParams = {
  client: ThirdwebClient;
};

const ewsSDKCache = new WeakMap<ThirdwebClient, InAppConnector>();

/**
 * @internal
 */
async function getInAppWalletConnector(client: ThirdwebClient) {
  if (ewsSDKCache.has(client)) {
    return ewsSDKCache.get(client) as InAppConnector;
  }

  let ewSDK: InAppConnector;
  if (isBrowser()) {
    const { InAppWebConnector } = await import(
      "../../web/lib/web-connector.js"
    );
    ewSDK = new InAppWebConnector({
      client: client,
    });
  } else if (isReactNative()) {
    const {
      InAppNativeConnector,
    } = require("../../native/native-connector.js");
    ewSDK = new InAppNativeConnector({
      client,
    });
  } else {
    throw new Error("Unsupported platform");
  }

  ewsSDKCache.set(client, ewSDK);
  return ewSDK;
}

/**
 * @internal
 */
export async function logoutAuthenticatedUser(
  options: GetAuthenticatedUserParams,
) {
  const ewSDK = await getInAppWalletConnector(options.client);
  return ewSDK.logout();
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
  const ewSDK = await getInAppWalletConnector(client);
  const user = await ewSDK.getUser();
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
  const ewSDK = await getInAppWalletConnector(args.client);
  return ewSDK.preAuthenticate(args);
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
  args: AuthArgsType,
): Promise<AuthLoginReturnType> {
  const ewSDK = await getInAppWalletConnector(args.client);
  return ewSDK.authenticate(args);
}

export const oauthStrategyToAuthProvider: Record<
  "google" | "facebook" | "apple",
  AuthProvider
> = {
  google: AuthProvider.GOOGLE,
  facebook: AuthProvider.FACEBOOK,
  apple: AuthProvider.APPLE,
};
