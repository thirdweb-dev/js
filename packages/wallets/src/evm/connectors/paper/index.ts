import { normalizeChainId } from "../../../lib/wagmi-core";
import { TWConnector } from "../../interfaces/tw-connector";
import {
  PaperWalletConnectionArgs,
  PaperWalletConnectorOptions,
} from "./types";
import {
  Chain as PChain,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { Chain } from "@thirdweb-dev/chains";
import type { providers, Signer } from "ethers";
import { utils } from "ethers";

export const PaperChainMap: Record<number, PChain> = {
  1: "Ethereum",
  5: "Goerli",
  137: "Polygon",
  80001: "Mumbai",
};

export class PaperWalletConnector extends TWConnector<PaperWalletConnectionArgs> {
  readonly id: string = "paper-wallet";
  readonly name: string = "Paper Wallet";
  ready: boolean = true;

  private user: InitializedUser | null = null;
  private paper?: PaperEmbeddedWalletSdk;
  private options: PaperWalletConnectorOptions;

  #signer?: Signer;

  constructor(options: PaperWalletConnectorOptions) {
    super();
    this.options = options;
  }

  private initPaperSDK() {
    if (!this.paper) {
      const chainName = PaperChainMap[this.options.chain.chainId];
      if (!chainName) {
        throw new Error("Unsupported chain id: " + this.options.chain.chainId);
      }
      this.paper = new PaperEmbeddedWalletSdk({
        clientId: this.options.clientId,
        chain: chainName,
      });
    }
  }

  async connect() {
    this.initPaperSDK();
    if (!this.paper) {
      throw new Error("Paper SDK not initialized");
    }
    let user = await this.paper.getUser();
    switch (user.status) {
      case UserStatus.LOGGED_OUT: {
        const authResult = await this.paper.auth.loginWithPaperModal();
        this.user = authResult.user;
        break;
      }
      case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
        this.user = user;
        break;
      }
    }
    if (!this.user) {
      throw new Error("Error connecting User");
    }

    this.setupListeners();
    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    // await this.paper?.auth.logout();
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
    // check if chainId is supported or not
    const chainName = PaperChainMap[chainId];
    if (!chainName) {
      throw new Error("Chain not supported");
    }

    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not configured");
    }

    // update chain in wallet
    await this.user?.wallet.setChain({ chain: chainName });

    // update signer
    this.#signer = await this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: chain.rpc[0],
    });

    this.emit("change", { chain: { id: chainId, unsupported: false } });
  }

  // private getUser() {
  //   if (!this.user) {
  //     throw new Error("User not found");
  //   }
  //   return this.user;
  // }

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

  protected isChainUnsupported(chainId: number) {
    return PaperChainMap[chainId] === undefined;
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.emit("disconnect");
  };
}
