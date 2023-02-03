import { DeviceWallet, DeviceWalletImpl } from "../../wallets/device-wallet";
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
  #wallet?: DeviceWalletImpl;

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
    return (await (await this.getSigner()).getAddress()) as `0x${string}`;
  }

  async getChainId() {
    return this.chainId;
  }

  async getProvider() {
    if (!this.#provider) {
      this.#provider = ethers.providers.getDefaultProvider(
        await this.getChainId(),
      );
    }
    return this.#provider;
  }

  async getSigner() {
    if (!this.#wallet) {
      this.#wallet = await DeviceWallet.fromCredentialStore();
    }
    return this.#wallet.getSigner();
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
    throw new Error("Not supported");
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
