import {
  Chains,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { Chain, Connector } from "@wagmi/core";
import { ethers, Signer } from "ethers";

interface PaperConnectorOptions {
  clientId: string;
  chain: Chains;
}

export const PaperChainMap: Record<number, Chains> = {
  1: "Ethereum",
  5: "Goerli",
  137: "Polygon",
  80001: "Mumbai",
};

export class PaperWalletConnector extends Connector<
  ethers.providers.Provider,
  PaperConnectorOptions,
  ethers.Signer
> {
  readonly id: string = "paper-wallet";
  readonly name: string = "Paper Wallet";
  ready: boolean = true;

  private user: InitializedUser | null = null;
  // initialize the SDK
  private paper: PaperEmbeddedWalletSdk;

  constructor({
    chains,
    options,
  }: {
    chains?: Chain[];
    options: PaperConnectorOptions;
  }) {
    super({ chains, options });
    this.paper = new PaperEmbeddedWalletSdk({
      clientId: options.clientId,
      chain: options.chain, // TODO map chain to paper chain
    });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    let getUser = await this.paper.getUser();
    switch (getUser.status) {
      case UserStatus.LOGGED_OUT: {
        const authResult = await this.paper.auth.loginWithPaperEmailOtp({
          email: "joaquim@thirdweb.com",
        });
        this.user = authResult.user;
        break;
      }
      case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
        this.user = getUser;
        break;
      }
    }
    if (!this.user) {
      throw new Error("Error connecting User");
    }
    return {
      account: await this.getAccount(),
      chain: { id: await this.getChainId(), unsupported: false },
      provider: this.getProvider(),
    };
  }

  async disconnect(): Promise<void> {
    this.user = null;
  }
  async getAccount(): Promise<`0x${string}`> {
    const addr = await this.getUser().wallet.getAddress();
    return addr as `0x${string}`;
  }

  async getChainId(): Promise<number> {
    return Promise.resolve(80001); // TODO map chain to paper chain
  }

  async getProvider(): Promise<ethers.providers.Provider> {
    const signer = await this.getSigner();
    if (!signer.provider) {
      throw new Error("Provider not found");
    }
    return signer.provider;
  }
  public async getSigner(): Promise<Signer> {
    // TODO get RPC from chains package
    const signer = this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: "https://mumbai.rpc.thirdweb.com",
    });
    if (!signer) {
      throw new Error("Signer not found");
    }
    return signer;
  }
  async isAuthorized(): Promise<boolean> {
    return false;
  }

  async switchChain(chainId: number): Promise<Chain> {
    const chainName = PaperChainMap[chainId];
    if (!chainName) {
      throw new Error("Chain not supported");
    }
    this.user?.wallet.setChain({ chain: chainName });
    const chain = this.chains.find((c) => c.id === chainId);
    if (!chain) {
      throw new Error("Chain not found");
    }
    return chain;
  }

  protected onAccountsChanged(accounts: `0x${string}`[]): void {}
  protected onChainChanged(chain: string | number): void {}
  protected onDisconnect(error: Error): void {}

  private getUser() {
    if (!this.user) {
      throw new Error("User not found");
    }
    return this.user;
  }
}
