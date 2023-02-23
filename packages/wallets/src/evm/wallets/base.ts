import { AsyncStorage } from "../../core/AsyncStorage";
import { thirdwebChains } from "../constants/chains";
import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import type { Chain } from "@wagmi/core";
import type { DAppMetaData } from "../../core/types/dAppMeta"

export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  // default: true
  shouldAutoConnect?: boolean;
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
    // make sure walletStorage is having the name walletId
    this.walletStorage = options.walletStorage;
  }

  protected abstract getConnector(): Promise<TWConnector<TConnectParams>>;

  async autoConnect() {
    console.log('autoConnect.abstractwallet: ', this.walletId)
    const lastConnectedWallet = await this.coordinatorStorage.getItem(
      "lastConnectedWallet",
    );

    if (lastConnectedWallet === this.walletId) {
      const lastConnectionParams = await this.walletStorage.getItem(
        "lastConnectedParams",
      );

      let parsedParams: ConnectParams<TConnectParams> | undefined;

      try {
        parsedParams = JSON.parse(lastConnectionParams as string);
      } catch {
        parsedParams = undefined;
      }

      console.log('autoConnect.getConnector')
      const connector = await this.getConnector();


      if (!(await connector.isConnected())) {
        console.log('this.connect')
        return await this.connect(parsedParams);
      }
    }
  }

  async connect(
    connectOptions?: ConnectParams<TConnectParams>,
  ): Promise<string> {
    console.log('connect.abstractwallet: ', this.walletId)
    const connector = await this.getConnector();

    // setup listeners to re-expose events
    connector.on("connect", (data) => {
      this.coordinatorStorage.setItem("lastConnectedWallet", this.walletId);
      this.emit("connect", { address: data.account, chainId: data.chain?.id });
      if (data.chain?.id) {
        this.walletStorage.setItem("lastConnectedChain", data.chain?.id);
      }
    });
    connector.on("change", (data) => {
      this.emit("change", { address: data.account, chainId: data.chain?.id });
      if (data.chain?.id) {
        this.walletStorage.setItem("lastConnectedChain", data.chain?.id);
      }
    });
    connector.on("message", (data) => this.emit("message", data));
    connector.on("disconnect", () => this.emit("disconnect"));
    connector.on("error", (error) => this.emit("error", error));

    // end event listener setups
    let connectedAddress = await connector.connect(connectOptions);
    // do not break on coordinator error
    try {
      // Store the last connected params in secure storage
      // await this.walletStorage.setItem(
      //   "lastConnectedParams",
      //   JSON.stringify(connectOptions),
      // );
      await this.coordinatorStorage.setItem(
        "lastConnectedWallet",
        this.walletId,
      );
    } catch { }

    return connectedAddress;
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
      // get the last connected wallet and check if it's this wallet, if so, remove it
      const lastConnectedWallet = await this.coordinatorStorage.getItem(
        "lastConnectedWallet",
      );
      if (lastConnectedWallet === this.walletId) {
        await this.coordinatorStorage.removeItem("lastConnectedWallet");
      }
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
