import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import {
  EmailWalletConnectionArgs,
  EmailWalletConnectorOptions,
} from "./types";
import {
  Chains,
  InitializedUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { providers, Signer } from "ethers";

export const PaperChainMap: Record<number, Chains> = {
  1: "Ethereum",
  5: "Goerli",
  137: "Polygon",
  80001: "Mumbai",
};

export class EmailWalletConnector extends TWConnector<EmailWalletConnectionArgs> {
  readonly id: string = "email-wallet";
  readonly name: string = "Email Wallet";
  ready: boolean = true;

  private user: InitializedUser | null = null;
  private paper?: PaperEmbeddedWalletSdk;
  private options: EmailWalletConnectorOptions;

  constructor(options: EmailWalletConnectorOptions) {
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

  async connect(args?: ConnectParams<EmailWalletConnectionArgs>) {
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
        /**
          TODO headless support
          await Paper.auth.sendPaperEmailLoginOtp({ email });
          const otp = await args?.handleOTP();
          const user = await Paper.auth.verifyPaperEmailLoginOtp({ email, otp });
         */
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
    return await this.getUser().wallet.getAddress();
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
}
