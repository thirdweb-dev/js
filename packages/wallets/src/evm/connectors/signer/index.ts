import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";
import { ConnectParams, Connector } from "../../interfaces/connector";
import type { LocalWalletConnectionArgs } from "../../wallets/local-wallet";
import type { Chain } from "@thirdweb-dev/chains";
import type { Signer } from "ethers";
import { providers } from "ethers";
import { getChainProvider } from "@thirdweb-dev/sdk";

export type SignerWalletConnectorOptions = {
  chain: Chain;
  signer: Signer;
  chains: Chain[];
  clientId?: string;
  secretKey?: string;
};

export class SignerConnector extends Connector<LocalWalletConnectionArgs> {
  options: SignerWalletConnectorOptions;
  #provider?: providers.Provider;
  #signer?: Signer;

  constructor(options: SignerWalletConnectorOptions) {
    super();
    this.options = options;
  }

  async connect(args: ConnectParams<LocalWalletConnectionArgs>) {
    if (args.chainId) {
      this.switchChain(args.chainId);
    }
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  async disconnect() {
    this.#provider = undefined;
    this.#signer = undefined;
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    if (!signer) {
      throw new Error("No signer found");
    }
    return await signer.getAddress();
  }

  async isConnected(): Promise<boolean> {
    try {
      const addr = await this.getAddress();
      return !!addr;
    } catch {
      return false;
    }
  }

  async getProvider() {
    if (!this.#provider) {
      this.#provider = getChainProvider(this.options.chain, {
        clientId: this.options.clientId,
        secretKey: this.options.secretKey,
      });
    }
    return this.#provider;
  }

  async getSigner() {
    if (!this.#signer) {
      const provider = await this.getProvider();
      this.#signer = getUpdatedSigner(this.options.signer, provider);
    }
    return this.#signer;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);

    if (!chain) {
      throw new Error(
        `Chain not found for chainId ${chainId}, please add it to the chains property when creating this wallet`,
      );
    }

    this.#provider = getChainProvider(chain, {
      clientId: this.options.clientId,
      secretKey: this.options.secretKey,
    });

    this.#signer = getUpdatedSigner(this.options.signer, this.#provider);

    this.onChainChanged(chainId);
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = !this.options.chains.find((c) => c.chainId === id);
    this.emit("change", { chain: { id, unsupported } });
  };

  async setupListeners() {}

  updateChains(chains: Chain[]): void {
    this.options.chains = chains;
  }
}

function getUpdatedSigner(signer: Signer, provider?: providers.Provider) {
  if (provider) {
    return signer.connect(provider);
  }
  return signer;
}
