import { providers } from "ethers";
import { Connector } from "../../interfaces/connector";
import GryFyn from "./lib/index";
import { Chain } from "@thirdweb-dev/chains";
import { GryFynProviderPopup } from "./lib/gryfynProviderPopup";

export type GryFynConnectorOptions = {
  apiKey: string;
  chains: Chain[];
};

export class GryFynConnector extends Connector {
  #provider?: providers.Web3Provider;
  #options: GryFynConnectorOptions;
  #gryfynProvider?: GryFynProviderPopup;

  constructor(options: GryFynConnectorOptions) {
    super();
    this.#options = options;
  }

  async connect(): Promise<string> {
    await this.getProvider();
    if (!this.#gryfynProvider) {
      throw new Error("No provider");
    }

    this.emit("message", { type: "connecting" });

    // THIS IS NOT WORKING
    const accounts = await this.#gryfynProvider.request({
      method: "eth_requestAccounts",
    });

    if (accounts?.code === 4100) {
      throw new Error("Not Logged in");
    }

    return accounts[0] as string;
  }

  async disconnect(): Promise<void> {
    // TODO
  }

  async getProvider() {
    if (this.#provider) {
      return this.#provider;
    }
    const gryfynProvider = GryFyn.getProvider(this.#options.apiKey, {});
    this.#gryfynProvider = gryfynProvider;

    const provider = new providers.Web3Provider(gryfynProvider);
    this.#provider = provider;
    return provider;
  }

  async getSigner() {
    const provider = await this.getProvider();
    const signer = provider.getSigner();
    return signer;
  }

  async getAddress() {
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  switchChain(chainId: number): Promise<void> {
    console.log(chainId);
    throw new Error("Method not implemented.");
  }

  async setupListeners(): Promise<void> {
    // TODO
  }

  async isConnected(): Promise<boolean> {
    try {
      const address = await this.getAddress();
      return !!address;
    } catch {
      return false;
    }
  }

  updateChains(chains: Chain[]): void {
    this.#options.chains = chains;
  }
}
