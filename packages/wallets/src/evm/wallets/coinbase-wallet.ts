import type { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  // Coinbase SDK uses Buffer for rendering the QRCode which requires a global polyfill
  window.Buffer = Buffer;
}

export type CoinbaseWalletOptions = WalletOptions<{headlessMode?: boolean}>;

export class CoinbaseWallet extends AbstractBrowserWallet {
  connector?: TWConnector;
  coinbaseConnector?: CoinbaseWalletConnector;
  static meta = {
    iconURL:
      "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
    name: "Coinbase Wallet",
  };

  static id = "coinbaseWallet" as const;
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

  async getQrCode() {
    await this.getConnector();
    if (!this.coinbaseConnector) {
      throw new Error("Coinbase connector not initialized");
    }
    return this.coinbaseConnector.getQrCode();
  }
}
