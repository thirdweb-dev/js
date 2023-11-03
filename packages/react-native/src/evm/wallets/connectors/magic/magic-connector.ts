import {
  Magic,
  MagicSDKAdditionalConfiguration,
} from "@magic-sdk/react-native-bare";
import { Chain, Connector, normalizeChainId } from "@thirdweb-dev/wallets";
import { Signer, ethers, providers } from "ethers";
import { defaultChains } from "@thirdweb-dev/chains/utils";
import { MagicConnectorOptions } from "./types";

export class MagicConnector extends Connector<MagicConnectorOptions> {
  magicSDK: Magic;
  magicOptions: MagicConnectorOptions;
  provider: any | undefined;
  chains: Chain[];
  magicSdkConfiguration: MagicSDKAdditionalConfiguration | undefined;
  connectedChainId: number | undefined;

  constructor(options: MagicConnectorOptions) {
    super();

    this.magicOptions = options;
    this.chains = options.chains ? options.chains : defaultChains;
    this.magicSdkConfiguration = options.magicSdkConfiguration;
    this.magicSDK = this.initializeMagicSDK({ chainId: options?.chainId || 0 });
  }

  async connect(options: MagicConnectorOptions): Promise<string> {
    if (!this.magicOptions.apiKey) {
      throw new Error("Magic API Key is not provided.");
    }

    // if (options.chainId) {
    //   this.initializeMagicSDK({ chainId: options.chainId });
    // }
    await this.getProvider();
    this.setupListeners();
    this.emit("message", { type: "connecting" });

    // Check if there is a user logged in
    const isAuthenticated = await this.isConnected();

    // Check if we have a chainId, in case of error just assign 0 for legacy
    let chainId: number;
    try {
      chainId = await this.getChainId();
    } catch (e) {
      chainId = 0;
    }

    this.connectedChainId = chainId;

    // if there is a user logged in, return the user
    if (isAuthenticated) {
      return await this.getAddress();
    }

    const magic = this.getMagicSDK();

    // LOGIN WITH MAGIC LINK WITH EMAIL
    if (options.email) {
      await magic.auth.loginWithEmailOTP({
        email: options.email,
      });
    }

    // LOGIN WITH MAGIC LINK WITH PHONE NUMBER
    if (options.phoneNumber) {
      await magic.auth.loginWithSMS({
        phoneNumber: options.phoneNumber,
      });
    }

    const signer = await this.getSigner();
    let address = await signer.getAddress();
    if (!address.startsWith("0x")) {
      address = `0x${address}`;
    }

    return address;
  }
  async disconnect(): Promise<void> {
    const magic = this.getMagicSDK();
    await magic.user.logout();
  }
  async getAddress(): Promise<string> {
    const signer = await this.getSigner();

    const account = await signer.getAddress();
    if (account.startsWith("0x")) {
      return account;
    }
    return `0x${account}`;
  }
  async getSigner(): Promise<Signer> {
    const provider = new ethers.providers.Web3Provider(
      (await this.getProvider()) as any, // TODO: fix type mismatch
    );
    const signer = await provider.getSigner();
    return signer;
  }
  getProvider(): Promise<providers.Provider> {
    if (this.provider) {
      return this.provider;
    }
    const magic = this.getMagicSDK();
    this.provider = magic.rpcProvider;
    return this.provider;
  }
  switchChain(chainId: number): Promise<void> {
    const chain = this.chains.find((c) => c.chainId === chainId);

    if (!chain) {
      throw new Error("Chain not found");
    }

    if (this.connectedChainId !== chainId) {
      this.initializeMagicSDK({ chainId });
    }

    return Promise.resolve();
  }
  isConnected(): Promise<boolean> {
    const magic = this.getMagicSDK();
    try {
      return magic.user.isLoggedIn();
    } catch (e) {
      return Promise.resolve(false);
    }
  }
  async setupListeners(): Promise<void> {
    this.provider?.on("accountsChanged", () => {
      throw new Error("Accounts changed not implemented");
    });
    this.provider?.on("chainChanged", this.onChainChanged);
    this.provider?.on("disconnect", this.onDisconnect);

    return Promise.resolve();
  }

  updateChains(chains: Chain[]): void {
    this.chains = chains;
  }

  // my methods

  onDisconnect(): void {
    this.emit("disconnect");
  }

  getMagicSDK() {
    if (!this.magicSDK) {
      return this.initializeMagicSDK();
    }
    return this.magicSDK;
  }

  initializeMagicSDK({ chainId }: { chainId?: number } = {}) {
    if (chainId) {
      const chain = this.chains.find((c) => c.chainId === chainId);
      if (chain) {
        this.magicSdkConfiguration = this.magicSdkConfiguration || {};
        this.magicSdkConfiguration.network = {
          rpcUrl: chain.rpc[0],
          chainId: chain.chainId,
        };
      }
    }

    this.magicSDK = new Magic(
      this.magicOptions.apiKey,
      this.magicSdkConfiguration,
    );
    this.provider = this.magicSDK.rpcProvider;

    return this.magicSDK;
  }

  async getChainId(): Promise<number> {
    const networkOptions = this.magicSdkConfiguration?.network;
    if (typeof networkOptions === "object") {
      const chainID = networkOptions.chainId;
      if (chainID) {
        return normalizeChainId(chainID);
      }
    }
    throw new Error("Chain ID is not defined");
  }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.chainId === chainId);
  }

  protected onChainChanged(chainId: string | number): void {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }
}
