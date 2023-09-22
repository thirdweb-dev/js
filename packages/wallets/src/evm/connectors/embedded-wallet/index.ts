import { Chain } from "@thirdweb-dev/chains";
import type { Signer, providers } from "ethers";
import { utils } from "ethers";
import { normalizeChainId } from "../../../lib/wagmi-core";
import { walletIds } from "../../constants/walletIds";
import { Connector } from "../../interfaces/connector";

import {
  AuthLoginReturnType,
  EmbeddedWalletSdk,
  InitializedUser,
  UserStatus,
} from "./implementations";
import {
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletConnectorOptions,
} from "./types";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  readonly id: string = walletIds.paper;
  readonly name: string = "Paper Wallet";
  ready = true;

  private user: InitializedUser | null = null;
  #embeddedWalletSdk?: EmbeddedWalletSdk;
  private options: EmbeddedWalletConnectorOptions;

  #signer?: Signer;

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;
  }

  getEmbeddedWalletSDK(): EmbeddedWalletSdk {
    if (!this.#embeddedWalletSdk) {
      this.#embeddedWalletSdk = new EmbeddedWalletSdk({
        clientId: this.options.clientId,
        chain: "Ethereum",
        styles: this.options.styles,
      });
    }
    return this.#embeddedWalletSdk;
  }

  async connect(options?: EmbeddedWalletConnectionArgs) {
    const thirdwebSDK = await this.getEmbeddedWalletSDK();
    if (!thirdwebSDK) {
      throw new Error("EmbeddedWallet SDK not initialized");
    }
    const user = await thirdwebSDK.getUser();
    switch (user.status) {
      case UserStatus.LOGGED_OUT: {
        let authResult: AuthLoginReturnType;

        switch (options?.loginType) {
          case "headless_google_oauth": {
            authResult = await thirdwebSDK.auth.loginWithGoogle({
              closeOpenedWindow: options.closeOpenedWindow,
              openedWindow: options.openedWindow,
            });
            break;
          }
          case "headless_email_otp_verification": {
            authResult = await thirdwebSDK.auth.verifyEmailLoginOtp({
              email: options.email,
              otp: options.otp,
            });
            break;
          }
          case "ui_email_otp": {
            authResult = await thirdwebSDK.auth.loginWithEmailOtp({
              email: options.email,
            });
            break;
          }
          default: {
            authResult = await thirdwebSDK.auth.loginWithModal();
            break;
          }
        }
        this.user = authResult.user;
        break;
      }
      case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
        if (options?.loginType === "headless_google_oauth") {
          if (options.closeOpenedWindow && options.openedWindow) {
            options.closeOpenedWindow(options.openedWindow);
          }
        }
        this.user = user;
        break;
      }
    }
    if (!this.user) {
      throw new Error("Error connecting User");
    }

    if (options?.chainId) {
      this.switchChain(options.chainId);
    }

    this.setupListeners();
    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    const paper = await this.#embeddedWalletSdk;
    await paper?.auth.logout();
    this.#signer = undefined;
    this.user = null;
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
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
    if (this.#signer) {
      return this.#signer;
    }

    if (!this.user) {
      const embeddedWalletSdk = await this.getEmbeddedWalletSDK();
      const user = await embeddedWalletSdk.getUser();
      switch (user.status) {
        case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
          this.user = user;
          break;
        }
      }
    }

    const signer = await this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: this.options.chain.rpc[0],
    });

    if (!signer) {
      throw new Error("Signer not found");
    }

    this.#signer = signer;

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

    // update chain in wallet
    await this.user?.wallet.setChain({ chain: "Ethereum" }); // just pass Ethereum no matter what chain we are going to connect

    // update signer
    this.#signer = await this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: chain.rpc[0],
    });

    this.emit("change", { chain: { id: chainId, unsupported: false } });
  }

  async setupListeners() {
    const provider = await this.getProvider();
    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
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

  async getEmail() {
    // implicit call to set the user
    await this.getSigner();
    if (!this.user) {
      throw new Error("No user found, Paper Wallet is not connected");
    }
    return this.user.authDetails.email;
  }
}
