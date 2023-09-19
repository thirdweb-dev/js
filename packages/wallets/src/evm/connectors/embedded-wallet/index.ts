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

  async connect(options?: {
    email?: string;
    chainId?: number;
    otp?: string;
    googleLogin?: true;
  }) {
    const thirdwebSDK = await this.getEmbeddedWalletSDK();
    if (!thirdwebSDK) {
      throw new Error("EmbeddedWallet SDK not initialized");
    }
    const user = await thirdwebSDK.getUser();
    switch (user.status) {
      case UserStatus.LOGGED_OUT: {
        let authResult: AuthLoginReturnType;

        // Show Google popup
        if (options?.googleLogin) {
          const googleWindow = window.open(
            "",
            "Login",
            "width=350, height=500",
          );
          authResult = await thirdwebSDK.auth.loginWithGoogle(
            googleWindow !== null
              ? {
                  openedWindow: googleWindow,
                  closeOpenedWindow: (openedWindow) => {
                    openedWindow.close();
                  },
                }
              : undefined,
          );
        }

        // Headless
        else if (options?.email && options?.otp) {
          authResult = await thirdwebSDK.auth.verifyEmailLoginOtp({
            email: options.email,
            otp: options.otp,
          });
        }

        // Show OTP modal
        else if (options?.email) {
          authResult = await thirdwebSDK.auth.loginWithEmailOtp({
            email: options.email,
          });
        }

        // Show Full Modal
        else {
          authResult = await thirdwebSDK.auth.loginWithModal();
        }

        this.user = authResult.user;
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
