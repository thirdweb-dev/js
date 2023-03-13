import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
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

  async connect(args?: ConnectParams<PaperWalletConnectionArgs>) {
    const email = args?.email;
    if (!email) {
      throw new Error("No Email provided");
    }
    this.initPaperSDK();
    if (!this.paper) {
      throw new Error("Paper SDK not initialized");
    }
    let user = await this.paper.getUser();
    switch (user.status) {
      case UserStatus.LOGGED_OUT: {
        const authResult = await this.paper.auth.loginWithPaperEmailOtp({
          email,
        });
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
    return this.getAddress();
  }

  async disconnect(): Promise<void> {
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
    const signer = this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: this.options.chain.rpc[0],
    });
    if (!signer) {
      throw new Error("Signer not found");
    }
    return signer;
  }

  async isAuthorized(): Promise<boolean> {
    return false;
  }

  async switchChain(chainId: number): Promise<void> {
    const chainName = PaperChainMap[chainId];
    if (!chainName) {
      throw new Error("Chain not supported");
    }
    // TODO this needs to update the signer, and emit events
    // this.user?.wallet.setChain({ chain: chainName });
    // throw for now
    throw new Error("Chain switch not supported");
  }

  private getUser() {
    if (!this.user) {
      throw new Error("User not found");
    }
    return this.user;
  }

  async setupListeners() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChains(chains: Chain[]): void {
    // no op
  }
}
