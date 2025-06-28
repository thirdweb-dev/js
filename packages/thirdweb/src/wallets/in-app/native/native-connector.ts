import type { ThirdwebClient } from "../../../client/client.js";
import { stringify } from "../../../utils/json.js";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import { nativeLocalStorage } from "../../../utils/storage/nativeStorage.js";
import type { Account } from "../../interfaces/wallet.js";
import { ClientScopedStorage } from "../core/authentication/client-scoped-storage.js";
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
import type { Ecosystem } from "../core/wallet/types.js";
import type { IWebWallet } from "../core/wallet/web-wallet.js";

type NativeConnectorOptions = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  passkeyDomain?: string;
  storage?: AsyncStorage;
};

export class InAppNativeConnector implements InAppConnector {
  private client: ThirdwebClient;
  private ecosystem?: Ecosystem;
  public storage: ClientScopedStorage;
  private passkeyDomain?: string;
  private wallet?: IWebWallet;

  constructor(options: NativeConnectorOptions) {
    this.client = options.client;
    this.passkeyDomain = options.passkeyDomain;
    this.ecosystem = options.ecosystem;
    this.storage = new ClientScopedStorage({
      clientId: this.client.clientId,
      ecosystem: options.ecosystem,
      storage: options.storage ?? nativeLocalStorage,
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
    const { getUserStatus } = await import(
      "../core/actions/get-enclave-user-status.js"
    );
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
          encryptionKey,
          storage: this.storage,
          storedToken: authResult.storedToken,
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
      const { EnclaveWallet } = await import(
        "../core/wallet/enclave-wallet.js"
      );
      this.wallet = new EnclaveWallet({
        address: wallet.address,
        client: this.client,
        ecosystem: this.ecosystem,
        storage: this.storage,
      });
    } else {
      const { ShardedWallet } = await import(
        "./helpers/wallet/sharded-wallet.js"
      );
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

  async preAuthenticate(args: MultiStepAuthProviderType): Promise<void> {
    const { sendOtp } = await import("../web/lib/auth/otp.js");
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
        const { verifyOtp } = await import("../web/lib/auth/otp.js");
        return verifyOtp(params);
      }
      case "guest": {
        const { guestAuthenticate } = await import(
          "../core/authentication/guest.js"
        );
        return guestAuthenticate({
          client: this.client,
          ecosystem: params.ecosystem,
          storage: this.storage,
        });
      }
      case "backend": {
        const { backendAuthenticate } = await import(
          "../core/authentication/backend.js"
        );
        return backendAuthenticate({
          client: this.client,
          ecosystem: params.ecosystem,
          walletSecret: params.walletSecret,
        });
      }
      case "wallet": {
        const { siweAuthenticate } = await import(
          "../core/authentication/siwe.js"
        );
        return siweAuthenticate({
          chain: params.chain,
          client: this.client,
          ecosystem: params.ecosystem,
          wallet: params.wallet,
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
        const { socialAuth } = await import("./auth/native-auth.js");
        const ExpoLinking = require("expo-linking");
        const redirectUrl =
          params.redirectUrl || (ExpoLinking.createURL("") as string);
        return socialAuth({
          auth: { redirectUrl, strategy },
          client: this.client,
          ecosystem: this.ecosystem,
        });
      }
      case "passkey":
        return this.passkeyAuth(params);
      case "jwt": {
        const { customJwt } = await import("../core/authentication/jwt.js");
        return customJwt({
          client: this.client,
          ecosystem: this.ecosystem,
          jwt: params.jwt,
        });
      }
      case "auth_endpoint": {
        const { authEndpoint } = await import(
          "../core/authentication/authEndpoint.js"
        );
        return authEndpoint({
          client: this.client,
          ecosystem: this.ecosystem,
          payload: params.payload,
        });
      }
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
        account,
        authDetails: authResult.storedToken.authDetails,
        status: "Logged In, Wallet Initialized",
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
        const { registerPasskey } = await import(
          "../core/authentication/passkeys.js"
        );
        authToken = await registerPasskey({
          client,
          ecosystem,
          passkeyClient,
          rp: {
            id: domain,
            name: domain,
          },
          storage: storeLastUsedPasskey ? storage : undefined,
          username: passkeyName,
        });
      } else {
        const { loginWithPasskey } = await import(
          "../core/authentication/passkeys.js"
        );
        authToken = await loginWithPasskey({
          client,
          ecosystem,
          passkeyClient,
          rp: {
            id: domain,
            name: domain,
          },
          storage: storeLastUsedPasskey ? storage : undefined,
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
    const { deleteActiveAccount } = await import("./auth/native-auth.js");
    return deleteActiveAccount({
      client: this.client,
      storage: this.storage,
    });
  }

  async logout(): Promise<LogoutReturnType> {
    const { logoutUser } = await import("./helpers/auth/logout.js");
    return logoutUser({
      client: this.client,
      storage: this.storage,
    });
  }

  async linkProfile(args: AuthArgsType) {
    const { linkAccount } = await import(
      "../core/authentication/linkAccount.js"
    );
    const { storedToken } = await this.authenticate(args);
    return await linkAccount({
      client: args.client,
      ecosystem: args.ecosystem || this.ecosystem,
      storage: this.storage,
      tokenToLink: storedToken.cookieString,
    });
  }

  async unlinkProfile(profile: Profile, allowAccountDeletion?: boolean) {
    const { unlinkAccount } = await import(
      "../core/authentication/linkAccount.js"
    );
    return await unlinkAccount({
      allowAccountDeletion,
      client: this.client,
      ecosystem: this.ecosystem,
      profileToUnlink: profile,
      storage: this.storage,
    });
  }

  async getProfiles() {
    const { getLinkedProfilesInternal } = await import(
      "../core/authentication/linkAccount.js"
    );
    return getLinkedProfilesInternal({
      client: this.client,
      ecosystem: this.ecosystem,
      storage: this.storage,
    });
  }
}
