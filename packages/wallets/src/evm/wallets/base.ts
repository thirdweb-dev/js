import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import type { DAppMetaData } from "../../core/types/dAppMeta";
import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { Chain, defaultChains } from "@thirdweb-dev/chains";

export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  // default: true
  shouldAutoConnect?: boolean;
  walletId?: string;
  walletStorage?: AsyncStorage;
  dappMetadata: DAppMetaData;
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
  protected options: WalletOptions<TAdditionalOpts>;
  static meta: WalletMeta;
  getMeta() {
    return (this.constructor as typeof AbstractBrowserWallet).meta;
  }

  constructor(walletId: string, options: WalletOptions<TAdditionalOpts>) {
    super();
    this.walletId = walletId;
    this.options = options;
    this.chains = options.chains || defaultChains;
    this.walletStorage =
      options.walletStorage || createAsyncLocalStorage(this.walletId);
  }

  protected abstract getConnector(): Promise<TWConnector<TConnectParams>>;

  /**
   * tries to auto connect to the wallet
   */
  async autoConnect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string | undefined> {
    return this.#connect(true, connectOptions);
  }

  /**
   * connect to the wallet
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

  async #connect(isAutoConnect: boolean, connectOptions?: ConnectParams<TConnectParams>) {
    const connector = await this.getConnector();

    this.#subscribeToEvents(connector);

    const isConnected = await connector.isConnected();

    if (isConnected) {
      const address = await connector.getAddress();
      connector.setupListeners();

      // ensure that connector is connected to the correct chain
      if (connectOptions?.chainId) {
        await connector.switchChain(connectOptions?.chainId);
      }

      return address;
    } else if (!isAutoConnect) {
      const address = await connector.connect(connectOptions);
      return address;
    }
  }

  async #subscribeToEvents(connector: TWConnector) {
    // subscribe to connector for events
    connector.on("connect", (data) => {
      this.emit("connect", {
        address: data.account,
        chainId: data.chain?.id,
      });

      if (data.chain?.id) {
        this.walletStorage.setItem(
          "lastConnectedChain",
          String(data.chain?.id),
        );
      }
    });

    connector.on("change", (data) => {
      this.emit("change", { address: data.account, chainId: data.chain?.id });
      if (data.chain?.id) {
        this.walletStorage.setItem(
          "lastConnectedChain",
          String(data.chain?.id),
        );
      }
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
