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

/**
 * Wallet Interface to connect [Coinbase Wallet](https://www.coinbase.com/wallet) extension or mobile app.
 *
 * @example
 * ```ts
 * import { CoinbaseWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new CoinbaseWallet();
 *
 * await wallet.connect();
 * ```
 *
 * @wallet
 */
export class CoinbaseWallet extends AbstractClientWallet {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  coinbaseConnector?: CoinbaseWalletConnector;

  /**
   * @internal
   */
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

  /**
   * @internal
   */
  static id = walletIds.coinbase as string;

  /**
   * @internal
   */
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  /**
   * @internal
   */
  headlessMode: boolean;

  /**
   * @internal
   */
  theme: "dark" | "light";

  /**
   *
   * @param options -
   * The `options` object contains the following properties:
   *
   * ### clientId (recommended)
   *
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   *
   * ### chains (optional)
   *
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to our [default chains](/react/react.thirdwebprovider#default-chains).
   *
   *
   * ### dappMetadata (optional)
   *
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url` and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { CoinbaseWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new CoinbaseWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp", // optional
   *     logoUrl: "https://thirdweb.com/favicon.ico", // optional
   *   },
   * });
   * ```
   *
   * ### headlessMode (optional)
   * This is only relevant applies when coinbase extension wallet is NOT installed on user's browser.
   *
   * By default `headlessMode` is set to `false` - which means that when user does not have coinbase wallet extension installed, a QR Code scan modal will open when calling the `connect` method to allow the user to connect to their coinbase mobile app by scanning the QR code.
   *
   * If headlessMode is set to `true` and coinbase wallet extension is not installed, the wallet will NOT open a QR Code scan modal - This is useful if you want to create a custom QR Code modal.
   *
   * you can use the `getQrUrl` method to get the QR Code url and create your own QR Code Modal
   *
   * Must be a `boolean`.
   */
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

  /**
   * Get the QR Code url to render a custom QR Code Modal for connecting to Coinbase Wallet.
   *
   * This method is only relevant when coinbase extension wallet is NOT installed on user's browser and `headlessMode` is set to `true`.
   *
   * @example
   * ```ts
   * const wallet = new CoinbaseWallet({ headlessMode: true });
   *
   * const qrUrl = await wallet.getQrUrl();
   * // render a QR Code Modal with the qrUrl
   *
   * const walletAddress = await wallet.connect(); // this is resolved when user scans the QR Code and wallet is connected
   *
   * console.log('connected to', walletAddress);
   * ```
   *
   * @returns
   */
  async getQrUrl() {
    await this.getConnector();
    if (!this.coinbaseConnector) {
      throw new Error("Coinbase connector not initialized");
    }
    return this.coinbaseConnector.getQrUrl();
  }
}
