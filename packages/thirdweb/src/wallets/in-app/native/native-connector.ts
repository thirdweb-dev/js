import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { stringify } from "../../../utils/json.js";
import { nativeLocalStorage } from "../../../utils/storage/nativeStorage.js";
import type { Account, Wallet } from "../../interfaces/wallet.js";
import {
  loginWithPasskey,
  registerPasskey,
} from "../core/authentication/passkeys.js";
import { siweAuthenticate } from "../core/authentication/siwe.js";
import {
  type AuthArgsType,
  type AuthLoginReturnType,
  type AuthStoredTokenWithCookieReturnType,
  type GetUser,
  type LogoutReturnType,
  type MultiStepAuthArgsType,
  type MultiStepAuthProviderType,
  type OauthOption,
  UserWalletStatus,
} from "../core/authentication/types.js";
import type { InAppConnector } from "../core/interfaces/connector.js";
import { sendOtp, verifyOtp } from "../web/lib/auth/otp.js";
import type { Ecosystem } from "../web/types.js";
import {
  authEndpoint,
  authenticate,
  customJwt,
  deleteActiveAccount,
  otpLogin,
  siweLogin,
  socialLogin,
} from "./auth/native-auth.js";
import { fetchUserDetails } from "./helpers/api/fetchers.js";
import { logoutUser } from "./helpers/auth/logout.js";
import { postAuth } from "./helpers/auth/middleware.js";
import { getWalletUserDetails } from "./helpers/storage/local.js";
import { getExistingUserAccount } from "./helpers/wallet/retrieval.js";

export type NativeConnectorOptions = {
  client: ThirdwebClient;
  partnerId?: string | undefined;
  passkeyDomain?: string;
};

export class InAppNativeConnector implements InAppConnector {
  private options: NativeConnectorOptions;

  constructor(options: NativeConnectorOptions) {
    this.options = options;
  }

  async getUser(): Promise<GetUser> {
    const localData = await getWalletUserDetails(this.options.client.clientId);
    const userStatus = await fetchUserDetails({
      client: this.options.client,
      email: localData?.email,
    });
    if (userStatus.status === UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED) {
      return {
        status: userStatus.status,
        authDetails: userStatus.storedToken.authDetails,
        walletAddress: userStatus.walletAddress,
        account: await this.getAccount(),
      };
    }
    if (userStatus.status === UserWalletStatus.LOGGED_IN_NEW_DEVICE) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        authDetails: userStatus.storedToken.authDetails,
      };
    }
    if (userStatus.status === UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        authDetails: userStatus.storedToken.authDetails,
      };
    }
    // Logged out
    return { status: UserWalletStatus.LOGGED_OUT };
  }
  getAccount(): Promise<Account> {
    return getExistingUserAccount({ client: this.options.client });
  }

  preAuthenticate(args: MultiStepAuthProviderType): Promise<void> {
    return sendOtp({
      ...args,
      client: this.options.client,
    });
  }

  async authenticate(
    params: AuthArgsType,
  ): Promise<AuthStoredTokenWithCookieReturnType> {
    const strategy = params.strategy;
    switch (strategy) {
      case "email":
      case "phone": {
        return verifyOtp(params);
      }
      case "wallet": {
        return siweAuthenticate({
          client: this.options.client,
          wallet: params.wallet,
          chain: params.chain,
        });
      }
      case "google":
      case "facebook":
      case "discord":
      case "apple": {
        const ExpoLinking = require("expo-linking");
        const redirectUrl =
          params.redirectUrl || (ExpoLinking.createURL("") as string);
        return authenticate({ strategy, redirectUrl }, this.options.client);
      }
      case "passkey":
        return this.passkeyAuth(params);
      default:
        throw new Error(`Unsupported authentication type: ${strategy}`);
    }
  }

  async connect(params: AuthArgsType): Promise<AuthLoginReturnType> {
    const strategy = params.strategy;
    switch (strategy) {
      case "email": {
        return await this.validateOtp({
          email: params.email,
          verificationCode: params.verificationCode,
          strategy: "email",
          client: this.options.client,
        });
      }
      case "phone": {
        return await this.validateOtp({
          phoneNumber: params.phoneNumber,
          verificationCode: params.verificationCode,
          strategy: "phone",
          client: this.options.client,
        });
      }
      case "google":
      case "facebook":
      case "discord":
      case "farcaster":
      case "telegram":
      case "apple": {
        const ExpoLinking = require("expo-linking");
        const redirectUrl =
          params.redirectUrl || (ExpoLinking.createURL("") as string); // Will default to the app scheme
        return this.socialLogin({
          strategy,
          redirectUrl,
        });
      }
      case "wallet": {
        return this.siweLogin({
          wallet: params.wallet,
          chain: params.chain,
        });
      }
      case "jwt": {
        return this.customJwt({
          jwt: params.jwt,
          password: params.encryptionKey,
        });
      }
      case "auth_endpoint": {
        return this.authEndpoint({
          payload: params.payload,
          encryptionKey: params.encryptionKey,
        });
      }
      case "passkey": {
        const authToken = await this.passkeyAuth(params);
        const account = await this.getAccount();
        return {
          user: {
            status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
            account,
            authDetails: authToken.storedToken.authDetails,
            walletAddress: account.address,
          },
        };
      }
      case "iframe": {
        throw new Error("iframe_email_verification is not supported in native");
      }
      case "iframe_email_verification": {
        throw new Error("iframe_email_verification is not supported in native");
      }
      default:
        assertUnreachable(strategy);
    }
  }

  private async passkeyAuth(args: {
    type: "sign-up" | "sign-in";
    passkeyName?: string;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
  }): Promise<AuthStoredTokenWithCookieReturnType> {
    const { type, passkeyName, client, ecosystem } = args;
    const domain = this.options.passkeyDomain;
    if (!domain) {
      throw new Error(
        "Passkey domain is required for native platforms. Please pass it in the 'auth' options when creating the inAppWallet().",
      );
    }
    try {
      const { PasskeyNativeClient } = await import("./auth/passkeys.js");
      const passkeyClient = new PasskeyNativeClient();
      const storage = nativeLocalStorage;
      let authToken: AuthStoredTokenWithCookieReturnType;

      if (type === "sign-up") {
        authToken = await registerPasskey({
          client,
          ecosystem,
          username: passkeyName,
          passkeyClient,
          storage,
          rp: {
            id: domain,
            name: domain,
          },
        });
      } else {
        authToken = await loginWithPasskey({
          client,
          ecosystem,
          passkeyClient,
          storage,
          rp: {
            id: domain,
            name: domain,
          },
        });
      }

      const toStoreToken: AuthStoredTokenWithCookieReturnType["storedToken"] = {
        jwtToken: authToken.storedToken.jwtToken,
        authDetails: authToken.storedToken.authDetails,
        authProvider: authToken.storedToken.authProvider,
        developerClientId: authToken.storedToken.developerClientId,
        cookieString: authToken.storedToken.cookieString,
        // we should always store the jwt cookie since there's no concept of cookie in react native
        shouldStoreCookieString: true,
        isNewUser: authToken.storedToken.isNewUser,
      };

      await postAuth({ storedToken: toStoreToken, client });

      return authToken;
    } catch (error) {
      console.error(
        `Error while signing in with passkey. ${(error as Error)?.message || typeof error === "object" ? stringify(error) : error}`,
      );
      if (error instanceof Error) {
        throw new Error(`Error signing in with passkey: ${error.message}`);
      }
      throw new Error("An unknown error occurred signing in with passkey");
    }
  }

  private async validateOtp(
    options: MultiStepAuthArgsType & {
      client: ThirdwebClient;
      ecosystem?: Ecosystem;
    },
  ): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await otpLogin(options);
      const account = await this.getAccount();
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          account,
          authDetails: storedToken.authDetails,
          walletAddress: account.address,
        },
      };
    } catch (error) {
      console.error(`Error while validating OTP: ${error}`);
      if (error instanceof Error) {
        throw new Error(`Error while validating otp: ${error.message}`);
      }
      throw new Error("An unknown error occurred while validating otp");
    }
  }

  // TODO (rn) expose in the interface
  async deleteActiveAccount() {
    return deleteActiveAccount({ client: this.options.client });
  }

  private async socialLogin(auth: OauthOption): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await socialLogin(auth, this.options.client);
      const account = await this.getAccount();
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          account,
          authDetails: storedToken.authDetails,
          walletAddress: account.address,
        },
      };
    } catch (error) {
      console.error(`Error while signing in with: ${auth}. ${error}`);
      if (error instanceof Error) {
        throw new Error(`Error signing in with ${auth}: ${error.message}`);
      }
      throw new Error(`An unknown error occurred signing in with ${auth}`);
    }
  }

  private async siweLogin(options: {
    wallet: Wallet;
    chain: Chain;
  }): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await siweLogin(
        this.options.client,
        options.wallet,
        options.chain,
      );
      const account = await this.getAccount();
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          account,
          authDetails: storedToken.authDetails,
          walletAddress: account.address,
        },
      };
    } catch (error) {
      console.error(
        `Error while signing in with: ${options.wallet.id}. ${error}`,
      );
      if (error instanceof Error) {
        throw new Error(
          `Error signing in with ${options.wallet.id}: ${error.message}`,
        );
      }
      throw new Error(
        `An unknown error occurred signing in with ${options.wallet.id}`,
      );
    }
  }

  private async customJwt(authOptions: {
    jwt: string;
    password: string;
  }): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await customJwt(authOptions, this.options.client);
      const account = await this.getAccount();
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          account,
          authDetails: storedToken.authDetails,
          walletAddress: account.address,
        },
      };
    } catch (error) {
      console.error(`Error while verifying auth: ${error}`);
      throw error;
    }
  }

  private async authEndpoint(authOptions: {
    payload: string;
    encryptionKey: string;
  }): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await authEndpoint(
        authOptions,
        this.options.client,
      );
      const account = await this.getAccount();
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          account,
          authDetails: storedToken.authDetails,
          walletAddress: account.address,
        },
      };
    } catch (error) {
      console.error(`Error while verifying auth_endpoint auth: ${error}`);
      throw error;
    }
  }

  logout(): Promise<LogoutReturnType> {
    return logoutUser(this.options.client.clientId);
  }
}

function assertUnreachable(x: never): never {
  throw new Error(`Invalid param: ${x}`);
}
