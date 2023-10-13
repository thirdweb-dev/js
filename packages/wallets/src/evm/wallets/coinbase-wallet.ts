import type { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { walletIds } from "../constants/walletIds";
import { AbstractClientWallet, WalletOptions } from "./base";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  // Coinbase SDK uses Buffer for rendering the QRCode which requires a global polyfill
  window.Buffer = Buffer;
}

export type CoinbaseWalletOptions = WalletOptions<{
  headlessMode?: boolean;
  theme?: "dark" | "light";
}>;

export class CoinbaseWallet extends AbstractClientWallet {
  connector?: Connector;
  coinbaseConnector?: CoinbaseWalletConnector;

  // TODO: remove this
  static meta = {
    iconURL:
      "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
    name: "Coinbase Wallet",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
      android: "https://play.google.com/store/apps/details?id=org.toshi",
      ios: "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455",
    },
  };

  static id= walletIds.coinbase as string;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  headlessMode: boolean;
  theme: "dark" | "light";

  constructor(options?: CoinbaseWalletOptions) {
    super(CoinbaseWallet.id, options);
    this.headlessMode = options?.headlessMode || false;

    this.theme =
      options?.theme || this.dappMetadata.isDarkMode === false
        ? "light"
        : "dark";
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );

      const cbConnector = new CoinbaseWalletConnector({
        chains: this.chains,
        options: {
          appName: this.dappMetadata.name,
          reloadOnDisconnect: false,
          darkMode: this.theme === "dark",
          headlessMode: this.headlessMode,
        },
      });

      cbConnector.on("connect", () => {});

      this.coinbaseConnector = cbConnector;
      this.connector = new WagmiAdapter(cbConnector);
    }
    return this.connector;
  }

  async getQrUrl() {
    await this.getConnector();
    if (!this.coinbaseConnector) {
      throw new Error("Coinbase connector not initialized");
    }
    return this.coinbaseConnector.getQrUrl();
  }
}
