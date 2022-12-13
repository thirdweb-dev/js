import { thirdwebChains } from "../constants/chains";
import { getCoordinatorStorage, getWalletStorage } from "../utils/storage";
import type { Chain, Connector as WagmiConnector } from "@wagmi/core";
import EventEmitter from "eventemitter3";

export type WalletData = {
  address?: string;
  chainId?: number;
};

export interface WalletEvents {
  connect(data: WalletData): void;
  change(data: WalletData): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

export type WalletOptions<TOpts extends Record<string, any> = {}> = {
  chains?: Chain[];
  // default: true
  shouldAutoConnect?: boolean;
  appName: string;
} & TOpts;

export abstract class AbstractWallet<
  TAdditionalOpts extends Record<string, any> = {},
> extends EventEmitter<WalletEvents> {
  #wallletId;
  protected coordinatorStorage;
  protected walletStorage;
  protected chains;
  protected options: WalletOptions<TAdditionalOpts>;

  constructor(walletId: string, options: WalletOptions<TAdditionalOpts>) {
    super();
    this.#wallletId = walletId;
    this.options = options;
    this.chains = options.chains || thirdwebChains;
    this.coordinatorStorage = getCoordinatorStorage();
    this.walletStorage = getWalletStorage(walletId);
    if (options.shouldAutoConnect !== false) {
      this.autoConnect();
    }
  }

  async autoConnect() {
    const lastConnectedWallet = await this.coordinatorStorage.getItem(
      "lastConnectedWallet",
    );

    if (lastConnectedWallet === this.#wallletId) {
      const lastConnectedChain = await this.walletStorage.getItem(
        "lastConnectedChain",
      );
      let parsedChain: number | undefined;

      try {
        parsedChain = parseInt(lastConnectedChain as string);
        if (isNaN(parsedChain)) {
          parsedChain = undefined;
        }
      } catch {
        parsedChain = undefined;
      }

      const connector = await this.getConnector();

      if (await connector.isAuthorized()) {
        return await this.connect(parsedChain);
      }
    }
  }

  protected abstract getConnector(): Promise<WagmiConnector>;

  async connect(
    chainId?: number,
  ): Promise<{ address: string; chainId: number }> {
    const connector = await this.getConnector();
    // setup listeners to re-expose events
    connector.on("connect", (data) => {
      this.coordinatorStorage.setItem("lastConnectedWallet", this.#wallletId);
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
    let connectionRes = await connector.connect({ chainId });
    // do not break on coordinator error
    try {
      await this.coordinatorStorage.setItem(
        "lastConnectedWallet",
        this.#wallletId,
      );
    } catch {}

    return {
      address: connectionRes.account,
      chainId: connectionRes.chain?.id,
    };
  }
  async getSigner(chainId?: number) {
    const connector = await this.getConnector();
    if (!connector) {
      throw new Error("Wallet not connected");
    }
    return await connector.getSigner({ chainId });
  }

  public async disconnect() {
    const connector = await this.getConnector();
    if (connector) {
      connector.removeAllListeners();
      await connector.disconnect();
      // get the last connected wallet and check if it's this wallet, if so, remove it
      const lastConnectedWallet = await this.coordinatorStorage.getItem(
        "lastConnectedWallet",
      );
      if (lastConnectedWallet === this.#wallletId) {
        await this.coordinatorStorage.removeItem("lastConnectedWallet");
      }
    }
  }
  async switchChain(chainId: number): Promise<Chain> {
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
