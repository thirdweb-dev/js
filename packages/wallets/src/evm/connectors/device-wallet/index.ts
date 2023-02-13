import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import type {
  DeviceWalletConnectionArgs,
  DeviceWalletImpl,
} from "../../wallets/device-wallet";
import type { Chain } from "@thirdweb-dev/chains";
import { ethers } from "ethers";

export type DeviceWalletConnectorOptions = {
  chain:
    | {
        chainId: number;
        rpc: string[];
      }
    | Chain;
  wallet: DeviceWalletImpl;
};

export class DeviceWalletConnector extends TWConnector<DeviceWalletConnectionArgs> {
  readonly id: string = "device_wallet";
  readonly name: string = "Device Wallet";
  options: DeviceWalletConnectorOptions;
  chainId: number;
  #wallet: DeviceWalletImpl;

  #provider?: ethers.providers.Provider;
  #signer?: ethers.Signer;

  protected shimDisconnectKey = "deviceWallet.shimDisconnect";

  constructor(options: DeviceWalletConnectorOptions) {
    super();
    this.options = options;
    this.chainId = options.chain.chainId;
    this.#wallet = options.wallet;
  }

  async connect(args: ConnectParams<DeviceWalletConnectionArgs>) {
    if (args.chainId) {
      this.chainId = args.chainId;
    }
    await this.initializeDeviceWallet(args.password);
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  async initializeDeviceWallet(password: string) {
    // TODO this should be a UI flow prior to calling connect instead
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

  async getChainId() {
    return this.chainId;
  }

  async getProvider() {
    if (!this.#provider) {
      this.#provider = new ethers.providers.JsonRpcBatchProvider(
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
    // TODO
    throw new Error("Not supported");
  }
}
