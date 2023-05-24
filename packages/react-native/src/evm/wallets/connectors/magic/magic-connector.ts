import { Provider } from "@ethersproject/abstract-provider";
import {
  Magic,
  MagicSDKAdditionalConfiguration,
} from "@magic-sdk/react-native-bare";
import { Chain, Connector, normalizeChainId } from "@thirdweb-dev/wallets";
import { Signer, ethers } from "ethers";
import { defaultChains } from "@thirdweb-dev/chains";
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
    this.magicSDK = this.initializeMagicSDK();
  }

  async connect(options: MagicConnectorOptions): Promise<string> {
    if (!this.magicOptions.apiKey) {
      throw new Error("Magic API Key is not provided.");
    }

    console.log("connect", options);
    if (options.chainId) {
      this.initializeMagicSDK({ chainId: options.chainId });
    }
    this.setupListeners();
    this.emit("message", { type: "connecting" });

    // Check if there is a user logged in
    const isAuthenticated = false; //await this.isConnected();
    console.log("isAuthenticated", isAuthenticated);

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

    // LOGIN WITH MAGIC LINK WITH OAUTH PROVIDER
    // if ("oauthProvider" in options) {
    //   await magic.oauth.loginWithRedirect({
    //     provider: options.oauthProvider,
    //     redirectURI: this.oauthCallbackUrl || window.location.href,
    //   });
    // }

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
    const provider = new ethers.providers.Web3Provider(
      (await this.getProvider()) as any, // TODO: fix type mismatch
    );
    const signer = provider.getSigner();
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
  getProvider(): Promise<Provider> {
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
    console.log("isConnected.after.getsdk");
    try {
      return magic.user.isLoggedIn();
    } catch (e) {
      console.log("isConnected.after.getsdk.catch", e);
      return Promise.resolve(false);
    }
  }
  async setupListeners(): Promise<void> {
    const provider = await this.getProvider();
    provider.on("accountsChanged", () => {
      console.log("accountsChanged");
    });
    provider.on("chainChanged", () => {
      console.log("chainChanged");
    });
    provider.on("disconnect", () => {
      console.log("disconnect");
    });

    return Promise.resolve();
  }
  updateChains(chains: Chain[]): void {
    console.log("updateChains", chains);
    throw new Error("Method not implemented.");
  }

  // my methods

  getMagicSDK() {
    if (!this.magicSDK) {
      return this.initializeMagicSDK();
    }
    return this.magicSDK;
  }

  initializeMagicSDK({ chainId }: { chainId?: number } = {}) {
    const options = {
      ...this.magicSdkConfiguration,
    };

    if (chainId) {
      const chain = this.chains.find((c) => c.chainId === chainId);
      if (chain) {
        options.network = {
          rpcUrl: chain.rpc[0],
          chainId: chain.chainId,
        };
      }
    }

    this.magicSDK = new Magic(this.magicOptions.apiKey, options);
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
}
