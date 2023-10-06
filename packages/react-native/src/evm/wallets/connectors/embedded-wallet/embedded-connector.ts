import {
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletConnectorOptions,
  OauthOption,
} from "./types";
import type { Chain } from "@thirdweb-dev/chains";
import { Connector, normalizeChainId } from "@thirdweb-dev/wallets";
import { providers, Signer } from "ethers";
import { utils } from "ethers";
import { sendEmailOTP, socialLogin, validateEmailOTP } from "./embedded/auth";
import { getEthersSigner } from "./embedded/signer";
import { logoutUser } from "./embedded/helpers/auth/logout";
import {
  clearConnectedEmail,
  getConnectedEmail,
  saveConnectedEmail,
} from "./embedded/helpers/storage/local";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  private options: EmbeddedWalletConnectorOptions;

  signer?: Signer;

  email?: string;

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;

    this.email = getConnectedEmail();
  }

  async connect(options?: { email?: string; chainId?: number }) {
    const connected = await this.isConnected();

    if (!connected) {
      throw new Error("Not connected");
    }

    if (options?.chainId) {
      this.switchChain(options.chainId);
    }

    this.setupListeners();
    return this.getAddress();
  }

  async validateEmailOtp(otp: string) {
    if (!this.email) {
      throw new Error("Email is required to connect");
    }

    try {
      await validateEmailOTP({
        clientId: this.options.clientId,
        otp,
      });
    } catch (error) {
      console.error(`Error while validating otp: ${error}`);
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "An unknown error occurred" };
      }
    }

    try {
      await this.getSigner();
      this.emit("connected");
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "Error getting the signer" };
      }
    }

    return { success: true };
  }

  async sendEmailOtp(email: string) {
    this.email = email;
    saveConnectedEmail(email);
    return sendEmailOTP(email, this.options.clientId);
  }

  async socialLogin(oauthOption: OauthOption) {
    try {
      await socialLogin(oauthOption, this.options.clientId);
    } catch (error) {
      console.error(
        `Error while signing in with: ${oauthOption.provider}. ${error}`,
      );
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "An unknown error occurred" };
      }
    }

    try {
      await this.getSigner();
      this.emit("connected");
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "Error getting the signer" };
      }
    }

    return { success: true };
  }

  async disconnect(): Promise<void> {
    clearConnectedEmail();
    await logoutUser(this.options.clientId);
    await this.onDisconnect();
    this.signer = undefined;
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
    if (this.signer) {
      return this.signer;
    }

    let signer;
    try {
      signer = await getEthersSigner(this.options.clientId);
    } catch (error) {
      console.error(`Error while getting the signer: ${error}`);
    }

    if (!signer) {
      throw new Error("Error fetching the signer");
    }

    this.signer = signer;

    if (this.options.chain.chainId) {
      this.signer = this.signer.connect(
        new providers.JsonRpcProvider(this.options.chain.rpc[0]),
      );
    }

    return signer;
  }

  async isAuthorized(): Promise<boolean> {
    return this.isConnected();
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not configured");
    }

    // update signer
    this.signer = await getEthersSigner(this.options.clientId);
    this.signer = this.signer.connect(
      new providers.JsonRpcProvider(chain.rpc[0]),
    );

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

  async removeListeners() {
    if (!this.signer) {
      return;
    }

    const provider = await this.getProvider();
    if (provider.off) {
      provider.off("accountsChanged", this.onAccountsChanged);
      provider.off("chainChanged", this.onChainChanged);
      provider.off("disconnect", this.onDisconnect);
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
    this.removeListeners();
    this.emit("disconnect");
  };

  getEmail() {
    return this.email;
  }
}
