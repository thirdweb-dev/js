import type { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { walletIds } from "../constants/walletIds";
import { AbstractClientWallet, WalletOptions } from "./base";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  // Coinbase SDK uses Buffer for rendering the QRCode which requires a global polyfill
  window.Buffer = Buffer;
}

export type CoinbaseWalletOptions = WalletOptions<{ headlessMode?: boolean }>;

export class CoinbaseWallet extends AbstractClientWallet {
  connector?: TWConnector;
  coinbaseConnector?: CoinbaseWalletConnector;
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

  static id = walletIds.coinbase;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  headlessMode: boolean;

  constructor(options?: CoinbaseWalletOptions) {
    super(CoinbaseWallet.id, options);
    this.headlessMode = options?.headlessMode || false;
  }

  protected async getConnector(): Promise<TWConnector> {
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
          darkMode: this.dappMetadata.isDarkMode,
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
