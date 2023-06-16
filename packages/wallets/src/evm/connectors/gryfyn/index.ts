import { providers, utils } from "ethers";
import { Connector } from "../../interfaces/connector";
import GryFyn from "./lib/index";
import { Chain } from "@thirdweb-dev/chains";
import { GryFynProviderPopup } from "./lib/gryfynProviderPopup";
import { normalizeChainId } from "../../../lib/wagmi-core";

export type GryFynConnectorOptions = {
  apiKey: string;
  chains: Chain[];
};

const supportedChainIds = new Set(["5", "80001", "97"]);

export class GryFynConnector extends Connector {
  #provider?: providers.Web3Provider;
  #options: GryFynConnectorOptions;
  #gryfynProvider?: GryFynProviderPopup;
  #signer?: providers.JsonRpcSigner;

  constructor(options: GryFynConnectorOptions) {
    super();
    this.#options = options;
  }

  async connect(options: { chainId?: number }): Promise<string> {
    await this.getProvider();
    if (!this.#gryfynProvider) {
      throw new Error("No provider");
    }

    this.emit("message", { type: "connecting" });

    if (options.chainId) {
      await this.#gryfynProvider.setChainId(options.chainId);
    }

    await this.#gryfynProvider.connect();

    const accounts = await this.#gryfynProvider.request({
      method: "eth_requestAccounts",
    });

    if (Array.isArray(accounts)) {
      return accounts[0] as string;
    }

    throw new Error("Not Logged in");
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

    const provider = new providers.Web3Provider(gryfynProvider, "any");
    this.#provider = provider;
    return provider;
  }

  async getSigner() {
    if (this.#signer) {
      return this.#signer;
    }
    const provider = await this.getProvider();
    this.#signer = provider.getSigner();

    return this.#signer;
  }

  async getAddress() {
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  async switchChain(chainId: number): Promise<void> {
    if (!supportedChainIds.has(String(chainId))) {
      throw new Error("Unsupported chain");
    }

    await this.getProvider();
    if (!this.#gryfynProvider) {
      throw new Error("No provider");
    }

    await this.#gryfynProvider.setChainID(String(chainId));
    const provider = new providers.Web3Provider(this.#gryfynProvider);

    this.#provider = provider;
    this.#signer = provider.getSigner();

    this.emit("change", { chain: { id: chainId, unsupported: false } });
  }

  async setupListeners(): Promise<void> {
    const provider = await this.getProvider();
    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
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
      this.#options.chains.findIndex((c) => c.chainId === id) === -1;
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.emit("disconnect");
  };
}
