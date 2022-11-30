import type { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import { thirdwebChains } from "../constants/chains";
import { getCoordinatorStorage, getWalletStorage } from "../utils/storage";
import { Chain } from "@wagmi/core";
import EventEmitter from "eventemitter3";

type WalletData = {
  address?: string;
  chainId?: number;
};

interface WalletEvents {
  connect(data: WalletData): void;
  change(data: WalletData): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

type WalletOptions = {
  chains?: Chain[];
  shouldAutoConnect?: boolean;
};

export class CoinbaseWallet extends EventEmitter<WalletEvents> {
  #chains: Chain[];
  #connector?: CoinbaseWalletConnector;
  #coordinator = getCoordinatorStorage();
  #walletStorage = getWalletStorage(CoinbaseWallet.id);

  static id = "coinbaseWallet" as const;
  static walletName = "Coinbase Wallet" as const;
  public get walletName() {
    return CoinbaseWallet.walletName;
  }

  constructor(
    options: WalletOptions = {
      shouldAutoConnect: true,
    },
  ) {
    super();
    this.#chains = options.chains || thirdwebChains;
    if (options.shouldAutoConnect !== false) {
      this.autoConnect();
    }
  }

  private async autoConnect() {
    const lastConnectedWallet = await this.#coordinator.getItem(
      "lastConnectedWallet",
    );
    console.log("Auto-connecting to Coinbase Wallet", {
      lastConnectedWallet,
    });
    if (lastConnectedWallet === CoinbaseWallet.id) {
      const lastConnectedChain = await this.#walletStorage.getItem(
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

      await this.connect(parsedChain);
    }
  }

  public async connect(chainId?: number) {
    if (!this.#connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );
      this.#connector = new CoinbaseWalletConnector({
        chains: this.#chains,
        options: {
          appName: "Wagmi",
        },
      });
    }
    // setup listeners to re-expose events
    this.#connector.on("connect", (data) => {
      this.#coordinator.setItem("lastConnectedWallet", CoinbaseWallet.id);
      this.emit("connect", { address: data.account, chainId: data.chain?.id });
      if (data.chain?.id) {
        this.#walletStorage.setItem("lastConnectedChain", data.chain?.id);
      }
    });
    this.#connector.on("change", (data) => {
      this.emit("change", { address: data.account, chainId: data.chain?.id });
      if (data.chain?.id) {
        this.#walletStorage.setItem("lastConnectedChain", data.chain?.id);
      }
    });
    this.#connector.on("message", (data) => this.emit("message", data));
    this.#connector.on("disconnect", () => this.emit("disconnect"));
    this.#connector.on("error", (error) => this.emit("error", error));
    // end event listener setups
    let connectionRes = await this.#connector.connect({ chainId });
    // do not break on coordinator error
    try {
      await this.#coordinator.setItem("lastConnectedWallet", CoinbaseWallet.id);
    } catch {}

    return connectionRes;
  }

  public async getSigner(chainId?: number) {
    if (!this.#connector) {
      throw new Error("Wallet not connected");
    }
    if (this.#connector) {
      return await this.#connector.getSigner({ chainId });
    }
  }

  public async switchChain(chainId: number) {
    if (!this.#connector) {
      throw new Error("Wallet not connected");
    }
    if (this.#connector) {
      return await this.#connector.switchChain(chainId);
    }
  }

  public async disconnect() {
    if (this.#connector) {
      this.#connector.removeAllListeners();
      await this.#connector.disconnect();
      // get the last connected wallet and check if it's this wallet, if so, remove it
      const lastConnectedWallet = await this.#coordinator.getItem(
        "lastConnectedWallet",
      );
      if (lastConnectedWallet === CoinbaseWallet.id) {
        await this.#coordinator.removeItem("lastConnectedWallet");
      }
    }
  }
}
