import { Chain, defaultChains, updateChainRPCs } from "@thirdweb-dev/chains";
import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import type { DAppMetaData } from "../../core/types/dAppMeta";
import { DEFAULT_DAPP_META } from "../constants/dappMeta";
import { EVMWallet } from "../interfaces";
import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractWallet } from "./abstract";

// eslint-disable-next-line @typescript-eslint/ban-types
export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  walletId?: string;
  walletStorage?: AsyncStorage;
  dappMetadata?: DAppMetaData;
  clientId?: string;
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
  static meta: WalletMeta;
  #connectParams: ConnectParams<TConnectParams> | undefined;
  getMeta() {
    return (this.constructor as typeof AbstractClientWallet).meta;
  }

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

  protected abstract getConnector(): Promise<Connector<TConnectParams>>;

  /**
   * tries to auto connect to the wallet
   */
  async autoConnect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    // remove chainId when autoconnecting to prevent switch-network popup on page load
    const options = connectOptions
      ? { ...connectOptions, chainId: undefined }
      : undefined;
    return this.#connect(true, options);
  }

  /**
   * connect to the wallet
   */
  async connect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    this.#connectParams = connectOptions;
    const address = await this.#connect(false, connectOptions);
    if (!address) {
      throw new Error("Failed to connect to the wallet.");
    }
    return address;
  }

  getConnectParams() {
    return this.#connectParams;
  }

  async #connect(
    isAutoConnect: boolean,
    connectOptions?: ConnectParams<TConnectParams>,
  ) {
    const connector = await this.getConnector();

    this.#subscribeToEvents(connector);

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

      return address;
    }

    if (isAutoConnect) {
      throw new Error("Failed to auto connect to the wallet.");
    }

    try {
      const address = await connector.connect(connectOptions);
      return address;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async #subscribeToEvents(connector: Connector) {
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

  async getSigner() {
    const connector = await this.getConnector();
    if (!connector) {
      throw new Error("Wallet not connected");
    }
    return await connector.getSigner();
  }

  public async disconnect() {
    const connector = await this.getConnector();
    if (connector) {
      await connector.disconnect();
      this.emit("disconnect");
      connector.removeAllListeners();
    }
  }

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

  async updateChains(chains: Chain[]) {
    this.chains = chains.map((c) => {
      return updateChainRPCs(c, this.options?.clientId);
    });
    const connector = await this.getConnector();
    connector.updateChains(this.chains);
  }

  /**
   * If the wallet uses a personal wallet under the hood, return it
   */
  getPersonalWallet(): EVMWallet | undefined {
    return undefined;
  }
}
