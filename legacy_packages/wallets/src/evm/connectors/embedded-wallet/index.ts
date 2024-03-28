import { Chain } from "@thirdweb-dev/chains";
import type { Signer, providers } from "ethers";
import { utils } from "ethers";
import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";
import { walletIds } from "../../constants/walletIds";
import { Connector } from "../../interfaces/connector";

import {
  AuthProvider,
  EmbeddedWalletSdk,
  InitializedUser,
  SendEmailOtpReturnType,
  UserWalletStatus,
} from "./implementations";
import {
  AuthParams,
  AuthResult,
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletConnectorOptions,
  EmbeddedWalletOauthStrategy,
} from "./types";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  readonly id: string = walletIds.paper;
  readonly name: string = "Embedded Wallet";
  ready = true;

  private user: InitializedUser | null = null;
  private _embeddedWalletSdk?: EmbeddedWalletSdk;
  private options: EmbeddedWalletConnectorOptions;
  private _signer?: Signer;

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;
  }

  getEmbeddedWalletSDK(): EmbeddedWalletSdk {
    if (!this._embeddedWalletSdk) {
      this._embeddedWalletSdk = new EmbeddedWalletSdk({
        clientId: this.options.clientId,
        chain: "Ethereum",
        onAuthSuccess: this.options.onAuthSuccess,
      });
    }
    return this._embeddedWalletSdk;
  }

  async connect(args?: EmbeddedWalletConnectionArgs): Promise<string> {
    // backwards compatibility - options should really be required here
    if (!args) {
      // default to iframe flow
      const result = await this.authenticate({ strategy: "iframe" });
      if (!result.user) {
        throw new Error("Error connecting User");
      }
      this.user = result.user;
    } else {
      if (!args.authResult) {
        throw new Error(
          "Missing authData - call authenticate() first with your authentication strategy",
        );
      }
      if (!args.authResult.user) {
        throw new Error(
          "Missing authData.user - call authenticate() first with your authentication strategy",
        );
      }
      this.user = args.authResult.user;
    }

    if (args?.chainId) {
      this.switchChain(args.chainId);
    }

    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    const paper = this._embeddedWalletSdk;
    await paper?.auth.logout();
    this._signer = undefined;
    this._embeddedWalletSdk = undefined;
    this.user = null;
  }

  async getAddress(): Promise<string> {
    if (!this.user) {
      throw new Error("Embedded Wallet is not connected");
    }
    return await this.getSigner().then((signer) => signer.getAddress());
  }

  async isConnected(): Promise<boolean> {
    try {
      const addr = await this.getAddress();
      return !!addr;
    } catch (e) {
      return false;
    }
  }

  async getProvider(): Promise<providers.Provider> {
    const signer = await this.getSigner();
    if (!signer.provider) {
      throw new Error("Provider not found");
    }
    return signer.provider;
  }

  public async getSigner(): Promise<Signer> {
    if (this._signer) {
      return this._signer;
    }

    const user = await this.getUser();
    const signer = await user.wallet.getEthersJsSigner({
      rpcEndpoint: this.options.chain.rpc[0] || "", // TODO: handle chain.rpc being empty array
    });

    if (!signer) {
      throw new Error("Signer not found");
    }

    this._signer = signer;

    return signer;
  }

  async isAuthorized(): Promise<boolean> {
    return false;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not configured");
    }

    try {
      // update chain in wallet
      await this.user?.wallet.setChain({ chain: "Ethereum" }); // just pass Ethereum no matter what chain we are going to connect
      // update signer
      this._signer = await this.user?.wallet.getEthersJsSigner({
        rpcEndpoint: chain.rpc[0] || "",
      });
      this.emit("change", { chain: { id: chainId, unsupported: false } });
    } catch (e) {
      console.warn("Failed to switch chain", e);
    }
  }

  async setupListeners() {
    return Promise.resolve();
  }

  updateChains(chains: Chain[]) {
    this.options.chains = chains;
  }

  protected onAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      await this.onDisconnect();
    } else {
      this.emit("change", {
        account: utils.getAddress(accounts[0] as string),
      });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported =
      this.options.chains.findIndex((c) => c.chainId === id) === -1;
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.emit("disconnect");
  };

  private async getUser(): Promise<InitializedUser> {
    if (
      !this.user ||
      !this.user.wallet ||
      !this.user.wallet.getEthersJsSigner // when serializing, functions are lost, need to rehydrate
    ) {
      const embeddedWalletSdk = this.getEmbeddedWalletSDK();
      const user = await embeddedWalletSdk.getUser();
      switch (user.status) {
        case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
          this.user = user;
          break;
        }
        default: {
          // if logged out or unitialized, we can't get a signer, so throw an error
          throw new Error(
            "Embedded Wallet is not authenticated, please authenticate first",
          );
        }
      }
    }
    return this.user;
  }

  async getEmail() {
    const user = await this.getUser();
    return user.authDetails.email;
  }

  async getRecoveryInformation() {
    const user = await this.getUser();
    return user.authDetails;
  }

  async sendVerificationEmail({
    email,
  }: {
    email: string;
  }): Promise<SendEmailOtpReturnType> {
    const ewSDK = this.getEmbeddedWalletSDK();
    return ewSDK.auth.sendEmailLoginOtp({ email });
  }

  async authenticate(params: AuthParams): Promise<AuthResult> {
    const ewSDK = this.getEmbeddedWalletSDK();
    const strategy = params.strategy;
    switch (strategy) {
      case "email_verification": {
        return await ewSDK.auth.verifyEmailLoginOtp({
          email: params.email,
          otp: params.verificationCode,
          recoveryCode: params.recoveryCode,
        });
      }
      case "apple":
      case "facebook":
      case "google": {
        const oauthProvider = oauthStrategyToAuthProvider[strategy];
        return ewSDK.auth.loginWithOauth({
          oauthProvider,
          closeOpenedWindow: params.closeOpenedWindow,
          openedWindow: params.openedWindow,
        });
      }
      case "jwt": {
        return ewSDK.auth.loginWithCustomJwt({
          jwt: params.jwt,
          encryptionKey: params.encryptionKey,
        });
      }
      case "auth_endpoint": {
        return ewSDK.auth.loginWithCustomAuthEndpoint({
          payload: params.payload,
          encryptionKey: params.encryptionKey,
        });
      }
      case "iframe_email_verification": {
        return ewSDK.auth.loginWithEmailOtp({
          email: params.email,
        });
      }
      case "iframe": {
        return ewSDK.auth.loginWithModal();
      }
      default:
        assertUnreachable(strategy);
    }
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Invalid param: " + x);
}

const oauthStrategyToAuthProvider: Record<
  EmbeddedWalletOauthStrategy,
  AuthProvider
> = {
  google: AuthProvider.GOOGLE,
  facebook: AuthProvider.FACEBOOK,
  apple: AuthProvider.APPLE,
};
