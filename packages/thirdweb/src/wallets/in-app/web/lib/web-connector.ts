import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { SocialAuthOption } from "../../../../wallets/types.js";
import type { Account } from "../../../interfaces/wallet.js";
import { getUserStatus } from "../../core/actions/get-enclave-user-status.js";
import { authEndpoint } from "../../core/authentication/authEndpoint.js";
import { backendAuthenticate } from "../../core/authentication/backend.js";
import { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import { guestAuthenticate } from "../../core/authentication/guest.js";
import { customJwt } from "../../core/authentication/jwt.js";
import {
  getLinkedProfilesInternal,
  linkAccount,
  unlinkAccount,
} from "../../core/authentication/linkAccount.js";
import {
  loginWithPasskey,
  registerPasskey,
} from "../../core/authentication/passkeys.js";
import { siweAuthenticate } from "../../core/authentication/siwe.js";
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
} from "../../core/authentication/types.js";
import type { InAppConnector } from "../../core/interfaces/connector.js";
import { EnclaveWallet } from "../../core/wallet/enclave-wallet.js";
import type { Ecosystem } from "../../core/wallet/types.js";
import type { IWebWallet } from "../../core/wallet/web-wallet.js";
import type { InAppWalletConstructorType } from "../types.js";
import { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
import { Auth, type AuthQuerierTypes } from "./auth/iframe-auth.js";
import { loginWithOauth, loginWithOauthRedirect } from "./auth/oauth.js";
import { sendOtp, verifyOtp } from "./auth/otp.js";
import { IFrameWallet } from "./iframe-wallet.js";

/**
 * @internal
 */
export class InAppWebConnector implements InAppConnector {
  private client: ThirdwebClient;
  private ecosystem?: Ecosystem;
  private querier: InAppWalletIframeCommunicator<AuthQuerierTypes>;
  private storage: ClientScopedStorage;

  private wallet?: IWebWallet;
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
    storage,
  }: InAppWalletConstructorType) {
    if (this.isClientIdLegacyPaper(client.clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    const baseUrl = getThirdwebBaseUrl("inAppWallet");
    this.client = client;
    this.ecosystem = ecosystem;
    this.passkeyDomain = passkeyDomain;
    this.storage = new ClientScopedStorage({
      storage: storage ?? webLocalStorage,
      clientId: client.clientId,
      ecosystem: ecosystem,
    });
    this.querier = new InAppWalletIframeCommunicator({
      clientId: client.clientId,
      ecosystem,
      baseUrl,
    });

    this.auth = new Auth({
      client,
      querier: this.querier,
      baseUrl,
      localStorage: this.storage,
      ecosystem,
      onAuthSuccess: async (authResult) => {
        onAuthSuccess?.(authResult);

        if (authResult.storedToken.authDetails.walletType === "sharded") {
          // If this is an existing sharded ecosystem wallet, we'll need to migrate
          const result = await this.querier.call<boolean>({
            procedureName: "migrateFromShardToEnclave",
            params: {
              storedToken: authResult.storedToken,
            },
          });
          if (!result) {
            console.warn(
              "Failed to migrate from sharded to enclave wallet, continuing with sharded wallet",
            );
          }
        }

        this.wallet = await this.initializeWallet(
          authResult.storedToken.cookieString,
        );

        if (!this.wallet) {
          throw new Error("Failed to initialize wallet");
        }

        const deviceShareStored =
          "deviceShareStored" in authResult.walletDetails
            ? authResult.walletDetails.deviceShareStored
            : undefined;

        await this.wallet.postWalletSetUp({
          storedToken: authResult.storedToken,
          deviceShareStored,
        });

        if (this.wallet instanceof IFrameWallet) {
          await this.querier.call({
            procedureName: "initIframe",
            params: {
              partnerId: ecosystem?.partnerId,
              ecosystemId: ecosystem?.id,
              clientId: this.client.clientId,
              // For enclave wallets we won't have a device share
              deviceShareStored:
                "deviceShareStored" in authResult.walletDetails
                  ? authResult.walletDetails.deviceShareStored
                  : null,
              walletUserId: authResult.storedToken.authDetails.userWalletId,
              authCookie: authResult.storedToken.cookieString,
            },
          });
        }

        return {
          user: {
            status: "Logged In, Wallet Initialized",
            authDetails: authResult.storedToken.authDetails,
            account: await this.wallet.getAccount(),
            walletAddress: authResult.walletDetails.walletAddress,
          },
        };
      },
    });
  }

  async initializeWallet(authToken?: string): Promise<IWebWallet> {
    const storedAuthToken = await this.storage.getAuthCookie();
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
    if (user.wallets.length === 0) {
      throw new Error(
        "Cannot initialize wallet, this user does not have a wallet generated yet",
      );
    }

    if (user.wallets[0]?.type === "enclave") {
      return new EnclaveWallet({
        client: this.client,
        ecosystem: this.ecosystem,
        address: user.wallets[0].address,
        storage: this.storage,
      });
    }

    return new IFrameWallet({
      client: this.client,
      ecosystem: this.ecosystem,
      querier: this.querier,
      localStorage: this.storage,
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
    // If we don't have a wallet yet we'll create one
    if (!this.wallet) {
      const localAuthToken = await this.storage.getAuthCookie();
      if (!localAuthToken) {
        return { status: "Logged Out" };
      }
      this.wallet = await this.initializeWallet(localAuthToken);
    }
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return await this.wallet.getUserWalletStatus();
  }

  getAccount(): Promise<Account> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.getAccount();
  }

  async preAuthenticate(args: MultiStepAuthProviderType): Promise<void> {
    return sendOtp({
      ...args,
      client: this.client,
      ecosystem: this.ecosystem,
    });
  }

  async authenticateWithRedirect(
    strategy: SocialAuthOption,
    mode?: "redirect" | "popup" | "window",
    redirectUrl?: string,
  ): Promise<void> {
    return loginWithOauthRedirect({
      authOption: strategy,
      client: this.client,
      ecosystem: this.ecosystem,
      redirectUrl,
      mode,
    });
  }

  async loginWithAuthToken(
    authResult: AuthStoredTokenWithCookieReturnType,
    recoveryCode?: string,
  ) {
    return this.auth.loginWithAuthToken(authResult, recoveryCode);
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
          client: this.client,
          ecosystem: this.ecosystem,
        });
      case "phone":
        return verifyOtp({
          ...args,
          client: this.client,
          ecosystem: this.ecosystem,
        });
      case "auth_endpoint": {
        return authEndpoint({
          payload: args.payload,
          client: this.client,
          ecosystem: this.ecosystem,
        });
      }
      case "jwt":
        return customJwt({
          jwt: args.jwt,
          client: this.client,
          ecosystem: this.ecosystem,
        });
      case "passkey": {
        return this.passkeyAuth(args);
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
      case "github":
      case "twitch":
      case "farcaster":
      case "line":
      case "x":
      case "steam":
      case "coinbase":
      case "discord": {
        return loginWithOauth({
          authOption: strategy,
          client: this.client,
          ecosystem: this.ecosystem,
          closeOpenedWindow: args.closeOpenedWindow,
          openedWindow: args.openedWindow,
        });
      }
      case "guest": {
        return guestAuthenticate({
          client: this.client,
          ecosystem: this.ecosystem,
          storage: webLocalStorage,
        });
      }
      case "backend": {
        return backendAuthenticate({
          client: this.client,
          walletSecret: args.walletSecret,
          ecosystem: this.ecosystem,
        });
      }
      case "wallet": {
        return siweAuthenticate({
          ecosystem: this.ecosystem,
          client: this.client,
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
      case "auth_endpoint":
      case "jwt": {
        const authToken = await this.authenticate(args);
        return await this.loginWithAuthToken(authToken, args.encryptionKey);
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
      case "backend":
      case "phone":
      case "email":
      case "wallet":
      case "apple":
      case "facebook":
      case "google":
      case "farcaster":
      case "telegram":
      case "github":
      case "line":
      case "x":
      case "guest":
      case "coinbase":
      case "twitch":
      case "steam":
      case "discord": {
        const authToken = await this.authenticate(args);
        return await this.auth.loginWithAuthToken(authToken);
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
    const { passkeyName, storeLastUsedPasskey = true } = args;
    const passkeyClient = new PasskeyWebClient();
    const storage = this.storage;
    if (args.type === "sign-up") {
      return registerPasskey({
        client: this.client,
        ecosystem: this.ecosystem,
        username: passkeyName,
        passkeyClient,
        storage: storeLastUsedPasskey ? storage : undefined,
        rp: {
          id: this.passkeyDomain ?? window.location.hostname,
          name: this.passkeyDomain ?? window.document.title,
        },
      });
    }
    return loginWithPasskey({
      client: this.client,
      ecosystem: this.ecosystem,
      passkeyClient,
      storage: storeLastUsedPasskey ? storage : undefined,
      rp: {
        id: this.passkeyDomain ?? window.location.hostname,
        name: this.passkeyDomain ?? window.document.title,
      },
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
      storage: this.storage,
      ecosystem: this.ecosystem,
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

function assertUnreachable(x: never, message?: string): never {
  throw new Error(message ?? `Invalid param: ${x}`);
}
