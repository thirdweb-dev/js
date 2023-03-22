import { normalizeChainId } from "../../../lib/wagmi-core";
import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import type {
  DeviceWalletConnectionArgs,
  DeviceWalletImpl,
} from "../../wallets/device-wallet";
import type { Chain } from "@thirdweb-dev/chains";
import type { Signer } from "ethers";
import { providers } from "ethers";

export type DeviceWalletConnectorOptions = {
  chain: Chain;
  wallet: DeviceWalletImpl;
  chains: Chain[];
};

export class DeviceWalletConnector extends TWConnector<DeviceWalletConnectionArgs> {
  readonly id: string = "device_wallet";
  readonly name: string = "Device Wallet";
  options: DeviceWalletConnectorOptions;
  #wallet: DeviceWalletImpl;

  #provider?: providers.Provider;
  #signer?: Signer;

  protected shimDisconnectKey = "deviceWallet.shimDisconnect";

  constructor(options: DeviceWalletConnectorOptions) {
    super();
    this.options = options;
    this.#wallet = options.wallet;
  }

  async connect(args: ConnectParams<DeviceWalletConnectionArgs>) {
    await this.initializeDeviceWallet(args.password);
    if (args.chainId) {
      this.switchChain(args.chainId);
    }
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  async initializeDeviceWallet(password: string) {
    const savedAddr = await this.#wallet.getSavedWalletAddress();
    if (!savedAddr) {
      await this.#wallet.generateNewWallet();
      await this.#wallet.save(password);
    } else {
      await this.#wallet.loadSavedWallet(password);
    }
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
    if (!this.#wallet) {
      throw new Error("No wallet found");
    }
    if (!this.#signer) {
      const provider = await this.getProvider();
      this.#signer = await this.#wallet.getSigner(provider);
    }
    return this.#signer;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not found");
    }

    this.#provider = new providers.JsonRpcBatchProvider(chain.rpc[0]);
    this.#signer = await this.#wallet.getSigner(this.#provider);
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
