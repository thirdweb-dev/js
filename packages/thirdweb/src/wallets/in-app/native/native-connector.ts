import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../interfaces/wallet.js";
import {
  type AuthArgsType,
  type AuthLoginReturnType,
  type GetUser,
  type LogoutReturnType,
  type OauthOption,
  type PreAuthArgsType,
  type SendEmailOtpReturnType,
  UserWalletStatus,
} from "../core/authentication/type.js";
import type { InAppConnector } from "../core/interfaces/connector.js";
import {
  authEndpoint,
  customJwt,
  deleteActiveAccount,
  sendVerificationEmail,
  sendVerificationSms,
  socialLogin,
  validateEmailOTP,
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

  preAuthenticate(params: PreAuthArgsType): Promise<SendEmailOtpReturnType> {
    const strategy = params.strategy;
    switch (strategy) {
      case "email": {
        return sendVerificationEmail({
          email: params.email,
          client: this.options.client,
        });
      }
      case "phone":
        return sendVerificationSms({
          phoneNumber: params.phoneNumber,
          client: this.options.client,
        });
      default:
        assertUnreachable(strategy);
    }
  }

  async authenticate(params: AuthArgsType): Promise<AuthLoginReturnType> {
    const strategy = params.strategy;
    switch (strategy) {
      case "email": {
        return await this.validateEmailOTP({
          email: params.email,
          otp: params.verificationCode,
          recoveryCode: params.verificationCode,
        });
      }
      case "phone": {
        return await this.validateEmailOTP({
          email: params.phoneNumber,
          otp: params.verificationCode,
          recoveryCode: params.verificationCode,
        });
      }
      case "google":
      case "facebook":
      case "discord":
      case "apple": {
        const ExpoLinking = require("expo-linking");
        const redirectUrl =
          params.redirectUrl || (ExpoLinking.createURL("") as string);
        return this.socialLogin({
          strategy,
          redirectUrl,
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

  private async validateEmailOTP(options: {
    email: string;
    otp: string;
    recoveryCode?: string;
  }): Promise<AuthLoginReturnType> {
    try {
      const { storedToken } = await validateEmailOTP({
        email: options.email,
        client: this.options.client,
        otp: options.otp,
        recoveryCode: options.recoveryCode,
      });
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
      console.error(`Error while validating otp: ${error}`);
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
