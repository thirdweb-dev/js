/* eslint-disable @typescript-eslint/ban-types */
import { Chain, defaultChains, updateChainRPCs } from "@thirdweb-dev/chains";
import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import type { DAppMetaData } from "../../core/types/dAppMeta";
import { DEFAULT_DAPP_META } from "../constants/dappMeta";
import { EVMWallet } from "../interfaces";
import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractWallet } from "./abstract";
import { track } from "../utils/analytics";

/**
 * General options required for creating a wallet instance
 */
export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  /**
   * chains supported by the wallet
   */
  chains?: Chain[];
  /**
   * Unique identifier for the wallet ( name of the wallet )
   */
  walletId?: string;
  /**
   * Storage to use for saving the wallet data
   */
  walletStorage?: AsyncStorage;
  /**
   * Metadata for the dapp. Some wallets use some of this data to display in their UI
   */
  dappMetadata?: DAppMetaData;
  /**
   * thirdweb apiKey client id. This is required to use thirdweb's infrastructure services like RPCs, IPFS Storage etc.
   *
   * You can create an API key for free on [thirdweb Dashboard](https://thirdweb.com/create-api-key)
   */
  clientId?: string;
  /**
   * Specify if analytics should be enabled or disabled for the wallet
   */
  analytics?: "enabled" | "disabled";
} & TOpts;

export type WalletMeta = {
  name: string;
  iconURL: string;
  urls?: {
    android?: string;
    ios?: string;
    chrome?: string;
    firefox?: string;
  };
};

/**
 * The base class for all client-side wallets (web, mobile) in the Wallet SDK. It extends AbstractWallet and adds client side specific logic.
 * A client side wallet delegates the wallet-specific connection logic to a Connector.
 *
 * This wallet is not meant to be used directly, but instead be extended to [build your own wallet](https://portal.thirdweb.com/wallet-sdk/v2/build)
 *
 * @abstractWallet
 */
export abstract class AbstractClientWallet<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TAdditionalOpts extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  TConnectParams extends Record<string, any> = {},
> extends AbstractWallet {
  walletId: string;
  protected walletStorage;
  protected chains;
  protected dappMetadata: DAppMetaData;
  protected options?: WalletOptions<TAdditionalOpts>;
  private _connectParams: ConnectParams<TConnectParams> | undefined;

  /**
   * @internal
   */
  static meta: WalletMeta;

  /**
   * @internal
   */
  getMeta() {
    return (this.constructor as typeof AbstractClientWallet).meta;
  }

  /**
   * Creates an returns instance of `AbstractClientWallet`
   *
   * @param walletId - A Unique identifier for the wallet ( name of the wallet )
   * @param options - Options for creating wallet instance
   */
  constructor(walletId: string, options?: WalletOptions<TAdditionalOpts>) {
    super();
    this.walletId = walletId;
    this.options = options;
    this.chains = (options?.chains || defaultChains).map((c) =>
      updateChainRPCs(c, options?.clientId),
    );
    this.dappMetadata = options?.dappMetadata || DEFAULT_DAPP_META;
    this.walletStorage =
      options?.walletStorage || createAsyncLocalStorage(this.walletId);
  }

  /**
   * Returns the Wallet Connector used by the wallet
   */
  protected abstract getConnector(): Promise<Connector<TConnectParams>>;

  /**
   * auto-connect the wallet if possible
   * @returns
   */
  async autoConnect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    // remove chainId when auto-connecting to prevent switch-network popup on page load
    const options = connectOptions
      ? { ...connectOptions, chainId: undefined }
      : undefined;
    return this._connect(true, options);
  }

  /**
   * Connect wallet
   * @param connectOptions - Options for connecting to the wallet
   * @returns
   */
  async connect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    this._connectParams = connectOptions;
    const address = await this._connect(false, connectOptions);
    if (!address) {
      throw new Error("Failed to connect to the wallet.");
    }
    return address;
  }

  /**
   * @internal
   * Get the options used for connecting to the wallet
   * @returns
   */
  getConnectParams() {
    return this._connectParams;
  }

  /**
   * @internal
   * Get the options used for creating the wallet instance
   */
  getOptions() {
    return this.options;
  }

  protected async _connect(
    isAutoConnect: boolean,
    connectOptions?: ConnectParams<TConnectParams>,
  ) {
    const connector = await this.getConnector();

    this._subscribeToEvents(connector);

    const isConnected = await connector.isConnected();

    // if already connected, return the address and setup listeners
    if (isConnected) {
      const address = await connector.getAddress();
      connector.setupListeners();

      // ensure that connector is connected to the correct chain
      if (connectOptions?.chainId) {
        await connector.switchChain(connectOptions?.chainId);
      }

      this.emit("connect", {
        address,
        chainId: await this.getChainId(),
      });

      this._trackConnection(address);
      return address;
    }

    if (isAutoConnect) {
      throw new Error("Failed to auto connect to the wallet.");
    }

    try {
      const address = await connector.connect(connectOptions);
      this._trackConnection(address);
      return address;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private _trackConnection(address: string) {
    track({
      clientId: this.options?.clientId || "",
      source: "connectWallet",
      action: "connect",
      walletType: this.walletId,
      walletAddress: address,
    });
  }

  private async _subscribeToEvents(connector: Connector) {
    // subscribe to connector for events
    connector.on("connect", (data) => {
      this.emit("connect", {
        address: data.account,
        chainId: data.chain?.id,
      });
    });

    connector.on("change", (data) => {
      this.emit("change", { address: data.account, chainId: data.chain?.id });
    });

    connector.on("message", (data) => {
      this.emit("message", data);
    });

    connector.on("disconnect", async () => {
      this.emit("disconnect");
    });
    connector.on("error", (error) => this.emit("error", error));
  }

  /**
   * Get [ethers Signer](https://docs.ethers.org/v5/api/signer/) object of the connected wallet
   */
  async getSigner() {
    const connector = await this.getConnector();
    if (!connector) {
      throw new Error("Wallet not connected");
    }
    return await connector.getSigner();
  }

  /**
   * Disconnect the wallet
   */
  public async disconnect() {
    const connector = await this.getConnector();
    if (connector) {
      await connector.disconnect();
      this.emit("disconnect");
      connector.removeAllListeners();
    }
  }

  /**
   * Switch to different Network/Blockchain in the connected wallet
   * @param chainId - The chainId of the network to switch to
   */
  async switchChain(chainId: number): Promise<void> {
    const connector = await this.getConnector();
    if (!connector) {
      throw new Error("Wallet not connected");
    }
    if (!connector.switchChain) {
      throw new Error("Wallet does not support switching chains");
    }
    return await connector.switchChain(chainId);
  }

  /**
   * Update the chains supported by the wallet. This is useful if wallet was initialized with some chains and this needs to be updated without re-initializing the wallet
   */
  async updateChains(chains: Chain[]) {
    this.chains = chains.map((c) => {
      return updateChainRPCs(c, this.options?.clientId);
    });
    const connector = await this.getConnector();
    connector.updateChains(this.chains);
  }

  /**
   * If the wallet uses another "personal wallet" under the hood, return it
   *
   * This is only useful for wallets like Safe or Smart Wallet uses a "personal wallet" under the hood to sign transactions. This method returns that wallet
   */
  getPersonalWallet(): EVMWallet | undefined {
    return undefined;
  }
}
