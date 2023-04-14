import { normalizeChainId } from "../../../lib/wagmi-core";
import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import type { DeviceWalletConnectionArgs } from "../../wallets/device-wallet";
import type { Chain } from "@thirdweb-dev/chains";
import type { Signer } from "ethers";
import { providers } from "ethers";
import type { Wallet } from "ethers";

export type DeviceWalletConnectorOptions = {
  chain: Chain;
  ethersWallet: Wallet;
  chains: Chain[];
};

export class DeviceWalletConnector extends TWConnector<DeviceWalletConnectionArgs> {
  readonly id: string = "device_wallet";
  readonly name: string = "Device Wallet";
  options: DeviceWalletConnectorOptions;

  #provider?: providers.Provider;
  #signer?: Signer;

  protected shimDisconnectKey = "deviceWallet.shimDisconnect";

  constructor(options: DeviceWalletConnectorOptions) {
    super();
    this.options = options;
  }

  async connect(args: ConnectParams<DeviceWalletConnectionArgs>) {
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
      this.#provider = new providers.JsonRpcBatchProvider(
        this.options.chain.rpc[0],
      );
    }
    return this.#provider;
  }

  async getSigner() {
    if (!this.#signer) {
      const provider = await this.getProvider();
      this.#signer = getSignerFromEthersWallet(
        this.options.ethersWallet,
        provider,
      );
    }
    return this.#signer;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not found");
    }

    this.#provider = new providers.JsonRpcBatchProvider(chain.rpc[0]);
    this.#signer = getSignerFromEthersWallet(
      this.options.ethersWallet,
      this.#provider,
    );
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

function getSignerFromEthersWallet(
  ethersWallet: Wallet,
  provider?: providers.Provider,
) {
  if (provider) {
    return ethersWallet.connect(provider);
  }
  return ethersWallet;
}
