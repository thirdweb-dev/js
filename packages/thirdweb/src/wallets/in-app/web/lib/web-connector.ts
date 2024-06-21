import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { Account } from "../../../interfaces/wallet.js";
import {
  type AuthLoginReturnType,
  type GetUser,
  type LogoutReturnType,
  type MultiStepAuthArgsType,
  type MultiStepAuthProviderType,
  type SendEmailOtpReturnType,
  type SingleStepAuthArgsType,
  UserWalletStatus,
  oauthStrategyToAuthProvider,
} from "../../core/authentication/type.js";
import type { InAppConnector } from "../../core/interfaces/connector.js";
import type { InAppWalletConstructorType } from "../types.js";
import { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
import { Auth, type AuthQuerierTypes } from "./auth/iframe-auth.js";
import { loginWithPasskey, registerPasskey } from "./auth/passkeys.js";
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
  }: InAppWalletConstructorType) {
    if (this.isClientIdLegacyPaper(client.clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    const baseUrl = getThirdwebBaseUrl("inAppWallet");
    this.client = client;
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
   * Gets the usr if they are logged in
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

  async preAuthenticate(
    args: MultiStepAuthProviderType,
  ): Promise<SendEmailOtpReturnType> {
    const strategy = args.strategy;
    switch (strategy) {
      case "email": {
        return this.auth.sendEmailLoginOtp({ email: args.email });
      }
      case "phone": {
        return this.auth.sendSmsLoginOtp({ phoneNumber: args.phoneNumber });
      }
      default:
        assertUnreachable(
          strategy,
          `Provider: ${strategy} doesn't require pre-authentication`,
        );
    }
  }

  async authenticate(
    args: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthLoginReturnType> {
    const strategy = args.strategy;
    switch (strategy) {
      case "email": {
        return await this.auth.verifyEmailLoginOtp({
          email: args.email,
          otp: args.verificationCode,
        });
      }
      case "phone": {
        return await this.auth.verifySmsLoginOtp({
          otp: args.verificationCode,
          phoneNumber: args.phoneNumber,
        });
      }
      case "apple":
      case "facebook":
      case "google": {
        const oauthProvider = oauthStrategyToAuthProvider[strategy];
        return this.auth.loginWithOauth({
          oauthProvider,
          closeOpenedWindow: args.closeOpenedWindow,
          openedWindow: args.openedWindow,
        });
      }
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
        return this.auth.loginWithEmailOtp({
          email: args.email,
        });
      }
      case "iframe": {
        return this.auth.loginWithModal();
      }
      case "passkey": {
        if (args.type === "sign-up") {
          const authToken = await registerPasskey({
            client: this.wallet.client,
            ecosystem: this.wallet.ecosystem,
            authenticatorType: args.authenticatorType,
            username: args.passkeyName,
          });
          return this.auth.loginWithAuthToken(authToken);
        }
        const authToken = await loginWithPasskey({
          client: this.wallet.client,
          ecosystem: this.wallet.ecosystem,
          authenticatorType: args.authenticatorType,
        });
        return this.auth.loginWithAuthToken(authToken);
      }
      default:
        assertUnreachable(strategy);
    }
  }

  async logout(): Promise<LogoutReturnType> {
    return await this.auth.logout();
  }
}

function assertUnreachable(x: never, message?: string): never {
  throw new Error(message ?? `Invalid param: ${x}`);
}
