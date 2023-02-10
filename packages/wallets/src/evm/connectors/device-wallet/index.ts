import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import type { DeviceWalletImpl } from "../../wallets/device-wallet";
import { ethers } from "ethers";

export type DeviceWalletConnectorOptions = {
  chainId: number;
  // TODO: Pass device wallet type here instead
  createWallet: () => Promise<DeviceWalletImpl>;
};

export class DeviceWalletConnector extends TWConnector {
  readonly id: string = "device_wallet";
  readonly name: string = "Device Wallet";
  options: DeviceWalletConnectorOptions;
  chainId: number;

  #provider?: ethers.providers.Provider;
  #signer?: ethers.Signer;
  #wallet?: DeviceWalletImpl;

  protected shimDisconnectKey = "deviceWallet.shimDisconnect";

  constructor(options: DeviceWalletConnectorOptions) {
    super();
    this.options = options;
    this.chainId = options.chainId;
  }

  async connect(args: ConnectParams) {
    if (args.chainId) {
      this.chainId = args.chainId;
    }
    this.#wallet = await this.options.createWallet();
    const signer = await this.getSigner();
    const account = (await signer.getAddress()) as `0x${string}`;
    return account;
  }

  async disconnect() {
    const provider = await this.getProvider();
    if (!provider?.removeListener) {
      return;
    }
    this.#wallet = undefined;
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
      // TODO pull chains package here + getProviderForChain util + this.getChainId()
      this.#provider = new ethers.providers.JsonRpcBatchProvider(
        "https://goerli.rpc.thirdweb.com",
      );
    }
    return this.#provider;
  }

  async getSigner() {
    if (!this.#wallet) {
      throw new Error("No wallet found");
    }
    if (!this.#signer) {
      this.#signer = (await this.#wallet.getSigner()).connect(
        await this.getProvider(),
      );
    }
    return this.#signer;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async switchChain(chainId: number): Promise<void> {
    // TODO
    throw new Error("Not supported");
  }
}
