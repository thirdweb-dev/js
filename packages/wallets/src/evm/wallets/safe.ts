import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { SafeConnectionArgs } from "../connectors/safe/types";
import type { SafeConnector as SafeConnectorType } from "../connectors/safe";
import { walletIds } from "../constants/walletIds";

export { SafeSupportedChainsSet } from "../connectors/safe/constants";

// re-export the connection args for convenience
export type { SafeConnectionArgs } from "../connectors/safe/types";

export type SafeWalletOptions = WalletOptions;

/**
 * Wallet interface to connect [Safe wallet](https://safe.global/wallet).
 *
 * **To connect to a safe wallet, a personal wallet must first be connected.**
 *
 * @example
 * ```javascript
 * import { CoinbaseWallet, SafeWallet } from "@thirdweb-dev/wallets";
 * import { Ethereum } from "@thirdweb-dev/chains";
 *
 * // First, connect the personal wallet
 * const personalWallet = new CoinbaseWallet();
 * await personalWallet.connect();
 *
 * // Then, connect the Safe wallet
 * const wallet = new SafeWallet();
 * await wallet.connect({
 *   personalWallet: personalWallet,
 *   chain: Ethereum,
 *   safeAddress: "{{contract_address}}",
 * });
 * ```
 *
 * @wallet
 */
export class SafeWallet extends AbstractClientWallet<
  object,
  SafeConnectionArgs
> {
  /**
   * @internal
   */
  connector?: SafeConnectorType;

  /**
   * @internal
   */
  static meta = {
    name: "Safe",
    iconURL:
      "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
  };

  /**
   * @internal
   */
  static id = walletIds.safe as string;

  /**
   * @internal
   */
  public get walletName() {
    return "Safe Wallet" as const;
  }

  /**
   * Create a `SafeWallet` instance.
   * @param options -
   * The `options` object includes the following properties:
   *
   * ### clientId (recommended)
   *
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### chains (optional)
   *
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to our [default chains](/react/react.thirdwebprovider#default-chains).
   *
   * ### dappMetadata (optional)
   *
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { SafeWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new SafeWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   }
   * });
   * ```
   *
   */
  constructor(options?: SafeWalletOptions) {
    super(SafeWallet.id, {
      ...options,
    });
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { SafeConnector } = await import("../connectors/safe");
      this.connector = new SafeConnector();
    }
    return this.connector;
  }

  /**
   * Get the personal wallet that is connected to the Safe wallet.
   * @returns
   */
  getPersonalWallet() {
    return this.connector?.personalWallet;
  }

  /**
   * Auto connect the wallet if it was previously connected.
   */
  autoConnect(params: ConnectParams<SafeConnectionArgs>) {
    return this.connect(params);
  }

  /**
   * Connect Safe wallet
   * @param connectOptions -
   * The `connectOptions` object includes the following properties:
   *
   * @example
   * ```javascript
   * import { CoinbaseWallet, SafeWallet } from "@thirdweb-dev/wallets";
   * import { Ethereum } from "@thirdweb-dev/chains";
   *
   * // First, connect the personal wallet
   * const personalWallet = new CoinbaseWallet();
   * await personalWallet.connect();
   *
   * // Then, connect the Safe wallet
   * const wallet = new SafeWallet();
   * await wallet.connect({
   *   personalWallet: personalWallet, // Wallet that can sign transactions on the Safe
   *   chain: Ethereum, // Chain that the Safe is on
   *   safeAddress: "{{contract_address}}", // Smart contract address of the Safe
   * });
   * ```
   *
   * ### personalWallet
   *
   * The instance of a personal wallet that can sign transactions on the Safe.
   *
   * Must be of type `EVMWallet` such as [`CoinbaseWallet`](/wallet/coinbase-wallet) or [`MetamaskWallet`](/wallet/metamask).
   *
   * ### chain
   *
   * The chain that the Safe smart contract is deployed to.
   *
   * Must be a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * ### safeAddress
   *
   * Smart contract address of the Safe wallet.
   *
   * Must be a `string`.
   *
   * @returns A Promise that resolves to the Safe address.
   */
  connect(
    connectOptions?: ConnectParams<SafeConnectionArgs> | undefined,
  ): Promise<string> {
    return super.connect(connectOptions);
  }
}
