import { AbstractBrowserWallet, WalletOptions } from "../../wallets/base";
import { DeviceWallet } from "../../wallets/device-wallet";
import {
  Chain,
  Connector,
  ConnectorNotFoundError,
  normalizeChainId,
  ProviderRpcError,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
} from "@wagmi/core";
import type { Address } from "abitype";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils.js";

export class DeviceBrowserWallet extends AbstractBrowserWallet {
  #connector?: DeviceWalletConnector;

  static id = "deviceWallet" as const;
  public get walletName() {
    return "Device Wallet" as const;
  }

  constructor(options: WalletOptions) {
    super(DeviceBrowserWallet.id, options);
  }

  protected async getConnector(): Promise<DeviceWalletConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      this.#connector = new DeviceWalletConnector({
        chains: this.chains,
        options: {
          name: this.options.appName,
        },
      });
    }
    return this.#connector;
  }
}

export type DeviceWalletConnectorOptions = {
  /** Name of connector */
  name?: string;
};

export class DeviceWalletConnector extends Connector<
  ethers.providers.Provider,
  DeviceWalletConnectorOptions,
  ethers.Signer
> {
  readonly id: string;
  readonly name: string;
  readonly ready: boolean;
  chainId: number;

  #provider?: ethers.providers.Provider;
  #signer?: ethers.Signer;
  #wallet?: DeviceWallet;

  protected shimDisconnectKey = "deviceWallet.shimDisconnect";

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: DeviceWalletConnectorOptions;
  } = {}) {
    const options = {
      name: "Device Wallet",
      ...options_,
    };
    super({ chains, options });
    this.id = "device_wallet";
    this.name = options.name;
    this.ready = true;
    this.chainId = chains?.[0].id || 1;
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      if (chainId) {
        this.chainId = chainId;
      }
      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      this.#wallet = await DeviceWallet.fromCredentialStore();

      const signer = await this.getSigner();
      const account = (await signer.getAddress()) as `0x${string}`;
      const id = await this.getChainId();

      return { account, chain: { id, unsupported: false }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      if ((error as RpcError).code === -32002) {
        throw new ResourceUnavailableError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    if (!provider?.removeListener) {
      return;
    }

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
    // TODO: Disconnect from wallet?
  }

  async getAccount() {
    const signer = await this.getSigner();
    if (!signer) {
      throw new Error("No signer found");
    }
    return (await signer.getAddress()) as `0x${string}`;
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

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async switchChain(chainId: number): Promise<Chain> {
    // not supported
    throw new Error("Not supported");
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: Address;
    decimals?: number;
    image?: string;
    symbol: string;
  }) {
    return false;
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", {
        account: getAddress(accounts[0] as string),
      });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.emit("disconnect");
  };

  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001;
  }
}
