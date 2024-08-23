import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { SocialAuthOption } from "../../../../wallets/types.js";
import type { Account } from "../../../interfaces/wallet.js";
import {
  loginWithPasskey,
  registerPasskey,
} from "../../core/authentication/passkeys.js";
import { siweAuthenticate } from "../../core/authentication/siwe.js";
import {
  type AuthLoginReturnType,
  type AuthStoredTokenWithCookieReturnType,
  type GetUser,
  type LogoutReturnType,
  type MultiStepAuthArgsType,
  type MultiStepAuthProviderType,
  type SingleStepAuthArgsType,
  UserWalletStatus,
} from "../../core/authentication/types.js";
import type { InAppConnector } from "../../core/interfaces/connector.js";
import type { InAppWalletConstructorType } from "../types.js";
import { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
import { Auth, type AuthQuerierTypes } from "./auth/iframe-auth.js";
import { loginWithOauth, loginWithOauthRedirect } from "./auth/oauth.js";
import { sendOtp, verifyOtp } from "./auth/otp.js";
import { IFrameWallet } from "./in-app-account.js";

/**
 * @internal
 */
export class InAppWebConnector implements InAppConnector {
  protected client: ThirdwebClient;
  protected querier: InAppWalletIframeCommunicator<AuthQuerierTypes>;

  private wallet: IFrameWallet;
  /**
   * Used to manage the Auth state of the user.
   */
  auth: Auth;
  private passkeyDomain?: string;

  private isClientIdLegacyPaper(clientId: string): boolean {
    if (clientId.indexOf("-") > 0 && clientId.length === 36) {
      return true;
    }
    return false;
  }

  /**
   * @example
   * `const thirdwebInAppWallet = new InAppWalletSdk({ clientId: "", chain: "Goerli" });`
   * @internal
   */
  constructor({
    client,
    onAuthSuccess,
    ecosystem,
    passkeyDomain,
  }: InAppWalletConstructorType) {
    if (this.isClientIdLegacyPaper(client.clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    const baseUrl = getThirdwebBaseUrl("inAppWallet");
    this.client = client;
    this.passkeyDomain = passkeyDomain;
    this.querier = new InAppWalletIframeCommunicator({
      clientId: client.clientId,
      ecosystem,
      baseUrl,
    });
    this.wallet = new IFrameWallet({
      client,
      ecosystem,
      querier: this.querier,
    });

    this.auth = new Auth({
      client,
      querier: this.querier,
      baseUrl,
      ecosystem,
      onAuthSuccess: async (authResult) => {
        onAuthSuccess?.(authResult);
        await this.wallet.postWalletSetUp({
          ...authResult.walletDetails,
          walletUserId: authResult.storedToken.authDetails.userWalletId,
        });
        await this.querier.call({
          procedureName: "initIframe",
          params: {
            partnerId: ecosystem?.partnerId,
            ecosystemId: ecosystem?.id,
            deviceShareStored: authResult.walletDetails.deviceShareStored,
            clientId: this.client.clientId,
            walletUserId: authResult.storedToken.authDetails.userWalletId,
            authCookie: authResult.storedToken.cookieString,
          },
        });
        return {
          user: {
            status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
            authDetails: authResult.storedToken.authDetails,
            account: await this.wallet.getAccount(),
            walletAddress: authResult.walletDetails.walletAddress,
          },
        };
      },
    });
  }

  /**
   * Gets the user if they're logged in
   * @example
   * ```js
   *  const user = await thirdwebInAppWallet.getUser();
   *  switch (user.status) {
   *     case UserWalletStatus.LOGGED_OUT: {
   *       // User is logged out, call one of the auth methods on thirdwebInAppWallet.auth to authenticate the user
   *       break;
   *     }
   *     case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
   *       // user is logged in and wallet is all set up.
   *       // You have access to:
   *       user.status;
   *       user.authDetails;
   *       user.walletAddress;
   *       user.wallet;
   *       break;
   *     }
   * }
   * ```
   * @returns GetUser - an object to containing various information on the user statuses
   */
  async getUser(): Promise<GetUser> {
    return this.wallet.getUserWalletStatus();
  }

  getAccount(): Promise<Account> {
    return this.wallet.getAccount();
  }

  async preAuthenticate(args: MultiStepAuthProviderType): Promise<void> {
    return sendOtp({
      ...args,
      client: this.wallet.client,
      ecosystem: this.wallet.ecosystem,
    });
  }

  authenticateWithRedirect(
    strategy: SocialAuthOption,
    mode?: "redirect" | "popup" | "window",
    redirectUrl?: string,
  ): void {
    loginWithOauthRedirect({
      authOption: strategy,
      client: this.wallet.client,
      ecosystem: this.wallet.ecosystem,
      redirectUrl,
      mode,
    });
  }

  async loginWithAuthToken(authResult: AuthStoredTokenWithCookieReturnType) {
    return this.auth.loginWithAuthToken(authResult);
  }

  /**
   * Authenticates the user and returns the auth token, but does not instantiate their wallet
   */
  async authenticate(
    args: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthStoredTokenWithCookieReturnType> {
    const strategy = args.strategy;
    switch (strategy) {
      case "email":
        return verifyOtp({
          ...args,
          client: this.wallet.client,
          ecosystem: this.wallet.ecosystem,
        });
      case "phone":
        return verifyOtp({
          ...args,
          client: this.wallet.client,
          ecosystem: this.wallet.ecosystem,
        });
      case "jwt":
        return this.auth.authenticateWithCustomJwt({
          jwt: args.jwt,
          encryptionKey: args.encryptionKey,
        });
      case "passkey": {
        return this.passkeyAuth(args);
      }
      case "auth_endpoint": {
        return this.auth.authenticateWithCustomAuthEndpoint({
          payload: args.payload,
          encryptionKey: args.encryptionKey,
        });
      }
      case "iframe_email_verification": {
        return this.auth.authenticateWithIframe({
          email: args.email,
        });
      }
      case "iframe": {
        return this.auth.authenticateWithModal();
      }
      case "apple":
      case "facebook":
      case "google":
      case "telegram":
      case "farcaster":
      case "discord": {
        return loginWithOauth({
          authOption: strategy,
          client: this.wallet.client,
          ecosystem: this.wallet.ecosystem,
          closeOpenedWindow: args.closeOpenedWindow,
          openedWindow: args.openedWindow,
        });
      }
      case "wallet": {
        return siweAuthenticate({
          ecosystem: this.wallet.ecosystem,
          client: this.wallet.client,
          wallet: args.wallet,
          chain: args.chain,
        });
      }
    }
  }

  /**
   * Authenticates the user then instantiates their wallet using the resulting auth token
   */
  async connect(
    args: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthLoginReturnType> {
    const strategy = args.strategy;
    switch (strategy) {
      case "jwt": {
        return this.auth.loginWithCustomJwt({
          jwt: args.jwt,
          encryptionKey: args.encryptionKey,
        });
      }
      case "auth_endpoint": {
        return this.auth.loginWithCustomAuthEndpoint({
          payload: args.payload,
          encryptionKey: args.encryptionKey,
        });
      }
      case "iframe_email_verification": {
        return this.auth.loginWithIframe({
          email: args.email,
        });
      }
      case "iframe": {
        return this.auth.loginWithModal();
      }
      case "passkey": {
        const authToken = await this.passkeyAuth(args);
        return this.loginWithAuthToken(authToken);
      }
      case "phone":
      case "email":
      case "wallet":
      case "apple":
      case "facebook":
      case "google":
      case "farcaster":
      case "telegram":
      case "discord": {
        const authToken = await this.authenticate(args);
        return this.auth.loginWithAuthToken(authToken);
      }

      default:
        assertUnreachable(strategy);
    }
  }

  async logout(): Promise<LogoutReturnType> {
    return await this.auth.logout();
  }

  private async passkeyAuth(
    args: Extract<SingleStepAuthArgsType, { strategy: "passkey" }>,
  ) {
    const { PasskeyWebClient } = await import("./auth/passkeys.js");
    const passkeyClient = new PasskeyWebClient();
    const storage = webLocalStorage;
    if (args.type === "sign-up") {
      return registerPasskey({
        client: this.wallet.client,
        ecosystem: this.wallet.ecosystem,
        username: args.passkeyName,
        passkeyClient,
        storage,
        rp: {
          id: this.passkeyDomain ?? window.location.hostname,
          name: this.passkeyDomain ?? window.document.title,
        },
      });
    }
    return loginWithPasskey({
      client: this.wallet.client,
      ecosystem: this.wallet.ecosystem,
      passkeyClient,
      storage,
      rp: {
        id: this.passkeyDomain ?? window.location.hostname,
        name: this.passkeyDomain ?? window.document.title,
      },
    });
  }
}

function assertUnreachable(x: never, message?: string): never {
  throw new Error(message ?? `Invalid param: ${x}`);
}
