import type { ThirdwebClient } from "../../../client/client.js";
import type { InjectedSupportedWalletIds } from "../../../wallets/__generated__/wallet-ids.js";
import type { Account } from "../../interfaces/wallet.js";
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
import { getWalletUserDetails } from "./helpers/storage/local.js";
import { getExistingUserAccount } from "./helpers/wallet/retrieval.js";

export type NativeConnectorOptions = {
  client: ThirdwebClient;
  partnerId?: string | undefined;
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
      case "siwe": {
        return siweAuthenticate({
          client: this.options.client,
          walletId: params.walletId,
          chainId: params.chainId,
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
      case "siwe": {
        return this.siweLogin({
          walletId: params.walletId,
          chainId: params.chainId,
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
        throw new Error("Passkey authentication is not implemented yet");
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
    walletId: InjectedSupportedWalletIds;
    chainId: number;
  }): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await siweLogin(
        this.options.client,
        options.walletId,
        options.chainId,
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
        `Error while signing in with: ${options.walletId}. ${error}`,
      );
      if (error instanceof Error) {
        throw new Error(
          `Error signing in with ${options.walletId}: ${error.message}`,
        );
      }
      throw new Error(
        `An unknown error occurred signing in with ${options.walletId}`,
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
