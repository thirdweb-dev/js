import type { ThirdwebClient } from "../../../client/client.js";
import { stringify } from "../../../utils/json.js";
import { nativeLocalStorage } from "../../../utils/storage/nativeStorage.js";
import type { Account } from "../../interfaces/wallet.js";
import { authEndpoint } from "../core/authentication/authEndpoint.js";
import { ClientScopedStorage } from "../core/authentication/client-scoped-storage.js";
import { guestAuthenticate } from "../core/authentication/guest.js";
import { customJwt } from "../core/authentication/jwt.js";
import {
  getLinkedProfilesInternal,
  linkAccount,
} from "../core/authentication/linkAccount.js";
import {
  loginWithPasskey,
  registerPasskey,
} from "../core/authentication/passkeys.js";
import { siweAuthenticate } from "../core/authentication/siwe.js";
import type {
  AuthArgsType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  GetUser,
  LogoutReturnType,
  MultiStepAuthArgsType,
  MultiStepAuthProviderType,
  SingleStepAuthArgsType,
} from "../core/authentication/types.js";
import type { InAppConnector } from "../core/interfaces/connector.js";
import { EnclaveWallet } from "../core/wallet/enclave-wallet.js";
import type { Ecosystem } from "../core/wallet/types.js";
import type { IWebWallet } from "../core/wallet/web-wallet.js";
import { getUserStatus } from "../web/lib/actions/get-enclave-user-status.js";
import { sendOtp, verifyOtp } from "../web/lib/auth/otp.js";
import { deleteActiveAccount, socialAuth } from "./auth/native-auth.js";
import { logoutUser } from "./helpers/auth/logout.js";
import { ShardedWallet } from "./helpers/wallet/sharded-wallet.js";

type NativeConnectorOptions = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  passkeyDomain?: string;
};

export class InAppNativeConnector implements InAppConnector {
  private client: ThirdwebClient;
  private ecosystem?: Ecosystem;
  private passkeyDomain?: string;
  private localStorage: ClientScopedStorage;
  private wallet?: IWebWallet;

  constructor(options: NativeConnectorOptions) {
    this.client = options.client;
    this.ecosystem = options.ecosystem;
    this.passkeyDomain = options.passkeyDomain;
    this.localStorage = new ClientScopedStorage({
      storage: nativeLocalStorage,
      clientId: this.client.clientId,
      ecosystemId: this.ecosystem?.id,
    });
  }

  async initializeWallet(authToken?: string) {
    const storedAuthToken = await this.localStorage.getAuthCookie();
    if (!authToken && storedAuthToken === null) {
      throw new Error(
        "No auth token provided and no stored auth token found to initialize the wallet",
      );
    }
    const user = await getUserStatus({
      authToken: authToken || (storedAuthToken as string),
      client: this.client,
      ecosystem: this.ecosystem,
    });
    if (!user) {
      throw new Error("Cannot initialize wallet, no user logged in");
    }
    const wallet = user.wallets[0];
    // TODO (enclaves): Migration to enclave wallet if sharded
    if (wallet && wallet.type === "enclave") {
      this.wallet = new EnclaveWallet({
        client: this.client,
        ecosystem: this.ecosystem,
        address: wallet.address,
        storage: this.localStorage,
      });
    } else {
      this.wallet = new ShardedWallet({
        client: this.client,
        storage: this.localStorage,
      });
    }
  }

  async getUser(): Promise<GetUser> {
    if (!this.wallet) {
      const localAuthToken = await this.localStorage.getAuthCookie();
      if (!localAuthToken) {
        return { status: "Logged Out" };
      }
      await this.initializeWallet(localAuthToken);
    }
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.getUserWalletStatus();
  }

  getAccount(): Promise<Account> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.getAccount();
  }

  preAuthenticate(args: MultiStepAuthProviderType): Promise<void> {
    return sendOtp({
      ...args,
      client: this.client,
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
      case "guest": {
        return guestAuthenticate({
          client: this.client,
          ecosystem: params.ecosystem,
          storage: nativeLocalStorage,
        });
      }
      case "wallet": {
        return siweAuthenticate({
          client: this.client,
          wallet: params.wallet,
          chain: params.chain,
          ecosystem: params.ecosystem,
        });
      }
      case "google":
      case "facebook":
      case "discord":
      case "line":
      case "x":
      case "apple": {
        const ExpoLinking = require("expo-linking");
        const redirectUrl =
          params.redirectUrl || (ExpoLinking.createURL("") as string);
        return socialAuth({
          auth: { strategy, redirectUrl },
          client: this.client,
          ecosystem: this.ecosystem,
        });
      }
      case "passkey":
        return this.passkeyAuth(params);
      case "jwt":
        return customJwt({
          jwt: params.jwt,
          client: this.client,
          storage: this.localStorage,
        });
      case "auth_endpoint":
        return authEndpoint({
          payload: params.payload,
          client: this.client,
          storage: this.localStorage,
        });
      default:
        throw new Error(`Unsupported authentication type: ${strategy}`);
    }
  }

  async connect(
    params: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthLoginReturnType> {
    const authResult = await this.authenticate({
      ...params,
      client: this.client,
      ecosystem: this.ecosystem,
    });
    await this.initializeWallet(authResult.storedToken.cookieString);
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    const encryptionKey =
      params.strategy === "jwt"
        ? params.encryptionKey
        : params.strategy === "auth_endpoint"
          ? params.encryptionKey
          : undefined;

    await this.wallet.postWalletSetUp({
      ...authResult,
      encryptionKey,
    });
    const account = await this.getAccount();
    return {
      user: {
        status: "Logged In, Wallet Initialized",
        account,
        authDetails: authResult.storedToken.authDetails,
        walletAddress: account.address,
      },
    };
  }

  private async passkeyAuth(args: {
    type: "sign-up" | "sign-in";
    passkeyName?: string;
    storeLastUsedPasskey?: boolean;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
  }): Promise<AuthStoredTokenWithCookieReturnType> {
    const {
      type,
      passkeyName,
      client,
      ecosystem,
      storeLastUsedPasskey = true,
    } = args;
    const domain = this.passkeyDomain;
    const storage = this.localStorage;
    if (!domain) {
      throw new Error(
        "Passkey domain is required for native platforms. Please pass it in the 'auth' options when creating the inAppWallet().",
      );
    }
    try {
      const { PasskeyNativeClient } = await import("./auth/passkeys.js");
      const passkeyClient = new PasskeyNativeClient();
      let authToken: AuthStoredTokenWithCookieReturnType;

      if (type === "sign-up") {
        authToken = await registerPasskey({
          client,
          ecosystem,
          username: passkeyName,
          passkeyClient,
          storage: storeLastUsedPasskey ? storage : undefined,
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
          storage: storeLastUsedPasskey ? storage : undefined,
          rp: {
            id: domain,
            name: domain,
          },
        });
      }

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

  // TODO (rn) expose in the interface
  async deleteActiveAccount() {
    return deleteActiveAccount({
      client: this.client,
      storage: this.localStorage,
    });
  }

  logout(): Promise<LogoutReturnType> {
    return logoutUser({
      client: this.client,
      storage: this.localStorage,
    });
  }

  async linkProfile(args: AuthArgsType) {
    const { storedToken } = await this.authenticate(args);
    return await linkAccount({
      client: args.client,
      tokenToLink: storedToken.cookieString,
      storage: this.localStorage,
      ecosystem: args.ecosystem || this.ecosystem,
    });
  }

  async getProfiles() {
    return getLinkedProfilesInternal({
      client: this.client,
      ecosystem: this.ecosystem,
      storage: this.localStorage,
    });
  }
}
