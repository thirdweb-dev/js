import { AsyncStorage } from "../../core/AsyncStorage";
import type { DAppMetaData } from "../../core/types/dAppMeta";
import { thirdwebChains } from "../constants/chains";
import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { Chain } from "@thirdweb-dev/chains";

export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  // default: true
  shouldAutoConnect?: boolean;
  walletId?: string;
  coordinatorStorage: AsyncStorage;
  walletStorage: AsyncStorage;
  dappMetadata: DAppMetaData;
} & TOpts;

export abstract class AbstractBrowserWallet<
  TAdditionalOpts extends Record<string, any> = {},
  TConnectParams extends Record<string, any> = {},
> extends AbstractWallet {
  walletId: string;
  protected coordinatorStorage;
  protected walletStorage;
  protected chains;
  protected options: WalletOptions<TAdditionalOpts>;

  constructor(walletId: string, options: WalletOptions<TAdditionalOpts>) {
    super();
    this.walletId = walletId;
    this.options = options;
    this.chains = options.chains || thirdwebChains;
    this.coordinatorStorage = options.coordinatorStorage;
    this.walletStorage = options.walletStorage;
  }

  protected abstract getConnector(): Promise<TWConnector<TConnectParams>>;

  /**
   * connect to the wallet if the last connected wallet is this wallet and not already connected
   */
  async autoConnect() {
    const lastConnectedWalletName = await this.coordinatorStorage.getItem(
      "lastConnectedWallet",
    );

    // return if the last connected wallet is not this wallet
    if (lastConnectedWalletName !== this.walletId) {
      return;
    }

    const lastConnectionParams = await this.walletStorage.getItem(
      "lastConnectedParams",
    );

    let parsedParams: ConnectParams<TConnectParams> | undefined;

    try {
      parsedParams = JSON.parse(lastConnectionParams as string);
    } catch {
      parsedParams = undefined;
    }

    // connect and return the account address
    return await this.connect(parsedParams);
  }

  /**
   * connect to the wallet
   */
  async connect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    const connector = await this.getConnector();

    this.#subscribeToEvents(connector);

    const saveToStorage = async () => {
      try {
        await this.walletStorage.setItem(
          "lastConnectedParams",
          JSON.stringify(connectOptions),
        );
        await this.coordinatorStorage.setItem(
          "lastConnectedWallet",
          this.walletId,
        );
      } catch (e) {
        console.error(e);
      }
    };

    const isConnected = await connector.isConnected();

    if (isConnected) {
      const address = await connector.getAddress();
      connector.setupListeners();
      await saveToStorage();
      return address;
    } else {
      const address = await connector.connect(connectOptions);
      await saveToStorage();
      return address;
    }
  }

  async #subscribeToEvents(connector: TWConnector) {
    // subscribe to connector for events
    connector.on("connect", (data) => {
      this.coordinatorStorage.setItem("lastConnectedWallet", this.walletId);
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
      await this.onDisconnect();
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

  protected async onDisconnect() {
    const lastConnectedWallet = await this.coordinatorStorage.getItem(
      "lastConnectedWallet",
    );
    if (lastConnectedWallet === this.walletId) {
      await this.coordinatorStorage.removeItem("lastConnectedWallet");
    }
  }

  public async disconnect() {
    const connector = await this.getConnector();
    if (connector) {
      await connector.disconnect();
      connector.removeAllListeners();
      await this.onDisconnect();
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
}
