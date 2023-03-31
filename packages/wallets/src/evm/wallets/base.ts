import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import type { DAppMetaData } from "../../core/types/dAppMeta";
import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { DEFAULT_DAPP_META } from "../constants/dappMeta";

export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  walletId?: string;
  walletStorage?: AsyncStorage;
  dappMetadata?: DAppMetaData;
} & TOpts;

export type WalletMeta = {
  name: string;
  iconURL: string;
};

export abstract class AbstractBrowserWallet<
  TAdditionalOpts extends Record<string, any> = {},
  TConnectParams extends Record<string, any> = {},
> extends AbstractWallet {
  walletId: string;
  protected walletStorage;
  protected chains;
  protected dappMetadata: DAppMetaData;
  protected options?: WalletOptions<TAdditionalOpts>;
  static meta: WalletMeta;
  getMeta() {
    return (this.constructor as typeof AbstractBrowserWallet).meta;
  }

  constructor(walletId: string, options?: WalletOptions<TAdditionalOpts>) {
    super();
    this.walletId = walletId;
    this.options = options;
    this.chains = options?.chains || defaultChains;
    this.dappMetadata = options?.dappMetadata || DEFAULT_DAPP_META;
    this.walletStorage =
      options?.walletStorage || createAsyncLocalStorage(this.walletId);
  }

  protected abstract getConnector(): Promise<TWConnector<TConnectParams>>;

  /**
   * tries to auto connect to the wallet
   */
  async autoConnect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string | undefined> {
    // remove chainId when autoconnecting to prevent switch-network popup on page load
    const options = connectOptions
      ? { ...connectOptions, chainId: undefined }
      : undefined;
    return this.#connect(true, options);
  }

  /**
   * connect to the walletf
   */
  async connect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    const address = await this.#connect(false, connectOptions);
    if (!address) {
      throw new Error("Failed to connect to the wallet.");
    }
    return address;
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

    const address = await connector.connect(connectOptions);
    return address;
  }

  async #subscribeToEvents(connector: TWConnector) {
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
    this.chains = chains;
    const connector = await this.getConnector();
    connector.updateChains(chains);
  }
}
