import type { ThirdwebClient } from "../../../../client/client.js";
import {
  AuthProvider,
  type AuthLoginReturnType,
} from "../../implementations/interfaces/auth.js";
import { UserWalletStatus } from "../../implementations/interfaces/embedded-wallets/embedded-wallets.js";
import type { EmbeddedWalletSdk } from "../../implementations/lib/embedded-wallet.js";
import type { AuthArgsType, PreAuthArgsType } from "./type.js";

const ewsSDKCache = new WeakMap<ThirdwebClient, EmbeddedWalletSdk>();

/**
 * @internal
 */
async function getEmbeddedWalletSDK(client: ThirdwebClient) {
  if (ewsSDKCache.has(client)) {
    return ewsSDKCache.get(client) as EmbeddedWalletSdk;
  }
  const { EmbeddedWalletSdk } = await import(
    "../../implementations/lib/embedded-wallet.js"
  );

  const ewSDK = new EmbeddedWalletSdk({
    client: client,
  });
  ewsSDKCache.set(client, ewSDK);
  return ewSDK;
}

export type GetAuthenticatedUserParams = {
  client: ThirdwebClient;
};

/**
 * Retrieves the authenticated user for the active embedded wallet.
 * @param options - The arguments for retrieving the authenticated user.
 * @returns The authenticated user if logged in and wallet initialized, otherwise undefined.
 * @example
 * ```ts
 * import { getAuthenticatedUser } from "thirdweb/wallets/embedded";
 *
 * const user = await getAuthenticatedUser({ client });
 * if (user) {
 *  console.log(user.walletAddress);
 * }
 * ```
 */
export async function getAuthenticatedUser(
  options: GetAuthenticatedUserParams,
) {
  const { client } = options;
  const ewSDK = await getEmbeddedWalletSDK(client);
  const user = await ewSDK.getUser();
  switch (user.status) {
    case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
      return user;
    }
  }
  return undefined;
}

/**
 * Retrieves the authenticated user email for the active embedded wallet.
 * @param options - The arguments for retrieving the authenticated user.
 * @returns The authenticated user email if authenticated with email or social logins, otherwise undefined.
 * @example
 * ```ts
 * import { getUserEmail } from "thirdweb/wallets/embedded";
 *
 * const email = await getUserEmail({ client });
 * console.log(email);
 * ```
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
 * import { preAuthenticate } from "thirdweb/wallets/embedded";
 *
 * const result = await preAuthenticate({
 *  client,
 *  strategy: "email",
 *  email: "example@example.org",
 * });
 * ```
 */
export async function preAuthenticate(args: PreAuthArgsType) {
  const ewSDK = await getEmbeddedWalletSDK(args.client);
  const strategy = args.strategy;
  switch (strategy) {
    case "email": {
      return ewSDK.auth.sendEmailLoginOtp({ email: args.email });
    }
    case "phone": {
      return ewSDK.auth.sendSmsLoginOtp({ phoneNumber: args.phoneNumber });
    }
    default:
      assertUnreachable(
        strategy,
        `Provider: ${strategy} does not require pre-authentication`,
      );
  }
}

/**
 * Authenticates the user based on the provided authentication arguments.
 * @param args - The authentication arguments.
 * @returns A promise that resolves to the authentication result.
 * @example
 * ```ts
 * import { authenticate } from "thirdweb/wallets/embedded";
 *
 * const result = await authenticate({
 *  client,
 *  strategy: "email",
 *  email: "example@example.org",
 *  verificationCode: "123456",
 * });
 * ```
 */
export async function authenticate(
  args: AuthArgsType,
): Promise<AuthLoginReturnType> {
  const ewSDK = await getEmbeddedWalletSDK(args.client);
  const strategy = args.strategy;
  switch (strategy) {
    case "email": {
      return await ewSDK.auth.verifyEmailLoginOtp({
        email: args.email,
        otp: args.verificationCode,
      });
    }
    case "phone": {
      return await ewSDK.auth.verifySmsLoginOtp({
        otp: args.verificationCode,
        phoneNumber: args.phoneNumber,
      });
    }
    case "apple":
    case "facebook":
    case "google": {
      const oauthProvider = oauthStrategyToAuthProvider[strategy];
      return ewSDK.auth.loginWithOauth({
        oauthProvider,
        closeOpenedWindow: args.closeOpenedWindow,
        openedWindow: args.openedWindow,
      });
    }
    case "jwt": {
      return ewSDK.auth.loginWithCustomJwt({
        jwt: args.jwt,
        encryptionKey: args.encryptionKey,
      });
    }
    case "auth_endpoint": {
      return ewSDK.auth.loginWithCustomAuthEndpoint({
        payload: args.payload,
        encryptionKey: args.encryptionKey,
      });
    }
    case "iframe_email_verification": {
      return ewSDK.auth.loginWithEmailOtp({
        email: args.email,
      });
    }
    case "iframe": {
      return ewSDK.auth.loginWithModal();
    }
    default:
      assertUnreachable(strategy);
  }
}

function assertUnreachable(x: never, message?: string): never {
  throw new Error(message ?? `Invalid param: ${x}`);
}

const oauthStrategyToAuthProvider: Record<
  "google" | "facebook" | "apple",
  AuthProvider
> = {
  google: AuthProvider.GOOGLE,
  facebook: AuthProvider.FACEBOOK,
  apple: AuthProvider.APPLE,
};
