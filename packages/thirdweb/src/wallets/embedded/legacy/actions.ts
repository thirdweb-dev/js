import type { ThirdwebClient } from "../../../index.js";
import type {
  MultiStepAuthArgsType,
  MultiStepAuthProviderType,
  SingleStepAuthArgsType,
} from "../core/authentication/type.js";
import { AuthProvider } from "./implementations/interfaces/auth.js";
import { UserWalletStatus } from "./implementations/interfaces/embedded-wallets/embedded-wallets.js";

/**
 * @internal
 */
async function getEmbeddedWalletSDK(client: ThirdwebClient) {
  const { EmbeddedWalletSdk } = await import(
    "./implementations/lib/embedded-wallet.js"
  );
  // TODO (ew) cache this
  const ewSDK = new EmbeddedWalletSdk({
    client: client,
  });
  return ewSDK;
}

/**
 * @internal
 */
export async function getAuthenticatedUser(args: { client: ThirdwebClient }) {
  const { client } = args;
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
 * @internal
 */
export async function preAuthenticate(
  args: MultiStepAuthProviderType & {
    client: ThirdwebClient;
  },
) {
  const ewSDK = await getEmbeddedWalletSDK(args.client);
  const strategy = args.provider;
  switch (strategy) {
    case "email": {
      return ewSDK.auth.sendEmailLoginOtp({ email: args.email });
    }
    default:
      throw new Error(
        `Provider: ${strategy} doesnt require pre-authentication`,
      );
  }
}

/**
 * @internal
 */
export async function authenticate(
  args: (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
    client: ThirdwebClient;
  },
) {
  const ewSDK = await getEmbeddedWalletSDK(args.client);
  const strategy = args.provider;
  switch (strategy) {
    case "email": {
      return await ewSDK.auth.verifyEmailLoginOtp({
        email: args.email,
        otp: args.verificationCode,
      });
    }
    case "apple":
    case "facebook":
    case "google": {
      const oauthProvider = oauthStrategyToAuthProvider[strategy];
      return ewSDK.auth.loginWithOauth({
        oauthProvider,
        // TODO (ew) bring this back
        // closeOpenedWindow: params.closeOpenedWindow,
        // openedWindow: params.openedWindow,
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

function assertUnreachable(x: never): never {
  throw new Error("Invalid param: " + x);
}

const oauthStrategyToAuthProvider: Record<
  "google" | "facebook" | "apple",
  AuthProvider
> = {
  google: AuthProvider.GOOGLE,
  facebook: AuthProvider.FACEBOOK,
  apple: AuthProvider.APPLE,
};
