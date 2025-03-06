import type { ThirdwebClient } from "../../../client/client.js";
import { stringify } from "../../../utils/json.js";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import { nativeLocalStorage } from "../../../utils/storage/nativeStorage.js";
import type { Account } from "../../interfaces/wallet.js";
import { getUserStatus } from "../core/actions/get-enclave-user-status.js";
import { authEndpoint } from "../core/authentication/authEndpoint.js";
import { backendAuthenticate } from "../core/authentication/backend.js";
import { ClientScopedStorage } from "../core/authentication/client-scoped-storage.js";
import { guestAuthenticate } from "../core/authentication/guest.js";
import { customJwt } from "../core/authentication/jwt.js";
import {
  getLinkedProfilesInternal,
  linkAccount,
  unlinkAccount,
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
  Profile,
  SingleStepAuthArgsType,
} from "../core/authentication/types.js";
import type { InAppConnector } from "../core/interfaces/connector.js";
import { EnclaveWallet } from "../core/wallet/enclave-wallet.js";
import type { Ecosystem } from "../core/wallet/types.js";
import type { IWebWallet } from "../core/wallet/web-wallet.js";
import { sendOtp, verifyOtp } from "../web/lib/auth/otp.js";
import { deleteActiveAccount, socialAuth } from "./auth/native-auth.js";
import { logoutUser } from "./helpers/auth/logout.js";
import { ShardedWallet } from "./helpers/wallet/sharded-wallet.js";
type NativeConnectorOptions = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  passkeyDomain?: string;
  storage?: AsyncStorage;
};

export class InAppNativeConnector implements InAppConnector {
  private client: ThirdwebClient;
  private ecosystem?: Ecosystem;
  private storage: ClientScopedStorage;
  private passkeyDomain?: string;
  private wallet?: IWebWallet;

  constructor(options: NativeConnectorOptions) {
    this.client = options.client;
    this.passkeyDomain = options.passkeyDomain;
    this.ecosystem = options.ecosystem;
    this.storage = new ClientScopedStorage({
      storage: options.storage ?? nativeLocalStorage,
      clientId: this.client.clientId,
      ecosystem: options.ecosystem,
    });
  }

  async initializeWallet(
    authResult?: AuthStoredTokenWithCookieReturnType,
    encryptionKey?: string,
  ) {
    const storedAuthToken = await this.storage.getAuthCookie();
    if (!authResult && storedAuthToken === null) {
      throw new Error(
        "No auth token provided and no stored auth token found to initialize the wallet",
      );
    }
    const user = await getUserStatus({
      authToken:
        authResult?.storedToken.cookieString || (storedAuthToken as string),
      client: this.client,
      ecosystem: this.storage.ecosystem,
    });
    if (!user) {
      throw new Error("Cannot initialize wallet, no user logged in");
    }
    let wallet = user.wallets[0];

    if (authResult && wallet && wallet.type === "sharded") {
      try {
        const { migrateToEnclaveWallet } = await import(
          "./helpers/wallet/migration.js"
        );
        wallet = await migrateToEnclaveWallet({
          client: this.client,
          storage: this.storage,
          storedToken: authResult.storedToken,
          encryptionKey,
        });
      } catch {
        console.warn(
          "Failed to migrate from sharded to enclave wallet, continuing with sharded wallet",
        );
      }
    }

    if (authResult && !wallet) {
      // new user, generate enclave wallet
      const { generateWallet } = await import(
        "../core/actions/generate-wallet.enclave.js"
      );
      wallet = await generateWallet({
        authToken: authResult.storedToken.cookieString,
        client: this.client,
        ecosystem: this.ecosystem,
      });
    }

    if (wallet && wallet.type === "enclave") {
      this.wallet = new EnclaveWallet({
        client: this.client,
        ecosystem: this.ecosystem,
        address: wallet.address,
        storage: this.storage,
      });
    } else {
      this.wallet = new ShardedWallet({
        client: this.client,
        storage: this.storage,
      });
    }
  }

  async getUser(): Promise<GetUser> {
    if (!this.wallet) {
      const localAuthToken = await this.storage.getAuthCookie();
      if (!localAuthToken) {
        return { status: "Logged Out" };
      }
      await this.initializeWallet();
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
      case "backend": {
        return backendAuthenticate({
          client: this.client,
          walletSecret: params.walletSecret,
          ecosystem: params.ecosystem,
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
      case "github":
      case "twitch":
      case "steam":
      case "farcaster":
      case "telegram":
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
          ecosystem: this.ecosystem,
        });
      case "auth_endpoint":
        return authEndpoint({
          payload: params.payload,
          client: this.client,
          ecosystem: this.ecosystem,
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
    const encryptionKey =
      params.strategy === "jwt"
        ? params.encryptionKey
        : params.strategy === "auth_endpoint"
          ? params.encryptionKey
          : undefined;
    await this.initializeWallet(authResult, encryptionKey);
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
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
    const storage = this.storage;
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
      storage: this.storage,
    });
  }

  logout(): Promise<LogoutReturnType> {
    return logoutUser({
      client: this.client,
      storage: this.storage,
    });
  }

  async linkProfile(args: AuthArgsType) {
    const { storedToken } = await this.authenticate(args);
    return await linkAccount({
      client: args.client,
      tokenToLink: storedToken.cookieString,
      storage: this.storage,
      ecosystem: args.ecosystem || this.ecosystem,
    });
  }

  async unlinkProfile(profile: Profile) {
    return await unlinkAccount({
      client: this.client,
      ecosystem: this.ecosystem,
      storage: this.storage,
      profileToUnlink: profile,
    });
  }

  async getProfiles() {
    return getLinkedProfilesInternal({
      client: this.client,
      ecosystem: this.ecosystem,
      storage: this.storage,
    });
  }
}
