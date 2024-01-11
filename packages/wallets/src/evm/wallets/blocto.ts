import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletMeta, WalletOptions } from "./base";
import { walletIds } from "../constants/walletIds";
import { Chain, updateChainRPCs } from "@thirdweb-dev/chains";

export type BloctoOptions = {
  /**
   * To get advanced features and support from Blocto, you can create an appId from [blocto dashboard](https://docs.blocto.app/blocto-sdk/register-app-id)
   */
  appId?: string;
  /**
   * Network to connect the wallet to
   */
  chain?: Chain;
};

/**
 * Wallet Interface to connect to [Blocto Wallet](https://blocto.io/)
 *
 * @example
 * ```javascript
 * import { BloctoWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new BloctoWallet();
 *
 * wallet.connect();
 * ```
 *
 * @wallet
 */
export class BloctoWallet extends AbstractClientWallet<BloctoOptions> {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  name: string = "Blocto";

  /**
   * @internal
   */
  static id = walletIds.blocto as string;

  /**
   * @internal
   */
  static meta: WalletMeta = {
    name: "Blocto",
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzIyMzNfMjM4NykiPgo8cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMyLjkwMjggMTguMzA2M0MyOC4zOTExIDE4LjMwNjMgMjMuOTg3MyAyMC4wNDU5IDIwLjY5NTIgMjMuMTMxOUMxNy4wODQzIDI2LjUxNzYgMTQuNzk5MiAzMS41MTc3IDEzLjQ4OTMgMzYuMjIxMkMxMi42MzE0IDM5LjI5OTIgMTIuMjAxNiA0Mi40OTE1IDEyLjIwMTYgNDUuNjg1M0MxMi4yMDE2IDQ2LjY1MTEgMTIuMjQxMiA0Ny42MDg5IDEyLjMxNzQgNDguNTU1NkMxMi40MTA5IDQ5LjcwNjkgMTMuNTMyMSA1MC41MDQ2IDE0LjY0ODUgNTAuMjAzM0MxNS42MjIyIDQ5Ljk0MTYgMTYuNjQ2NiA0OS44MDA1IDE3LjcwMjggNDkuODAwNUMxOS44NzIyIDQ5LjgwMDUgMjEuOTA1MiA1MC4zOTA0IDIzLjY0OCA1MS40MjEyQzIzLjY5MDggNTEuNDQ2NiAyMy43MzIgNTEuNDcxOSAyMy43NzQ4IDUxLjQ5NTdDMjYuNjA3MSA1My4xODQ2IDI5Ljk0ODQgNTQuMTEyMyAzMy41MTE3IDUzLjk5MzRDNDIuODA2MiA1My42ODU3IDUwLjM5OSA0Ni4xMjMgNTAuNzQxNiAzNi44MzAxQzUxLjExNTggMjYuNjYzNSA0Mi45ODY5IDE4LjMwNDcgMzIuOTA0NCAxOC4zMDQ3TDMyLjkwMjggMTguMzA2M1pNMzIuOTAyOCA0NC4zMTJDMjguMzk3NSA0NC4zMTIgMjQuNzQ1NCA0MC42NTk5IDI0Ljc0NTQgMzYuMTU2MkMyNC43NDU0IDMxLjY1MjUgMjguMzk3NSAyNy45OTg3IDMyLjkwMjggMjcuOTk4N0MzNy40MDgxIDI3Ljk5ODcgNDEuMDYwMiAzMS42NTA5IDQxLjA2MDIgMzYuMTU2MkM0MS4wNjAyIDQwLjY2MTQgMzcuNDA4MSA0NC4zMTIgMzIuOTAyOCA0NC4zMTJaIiBmaWxsPSIjMTRBQUZGIi8+CjxwYXRoIGQ9Ik0yNS41NjM2IDEyLjY4MjZDMjUuNTYzNiAxNS4wMzQ0IDI0LjMzMTUgMTcuMjE2NCAyMi4zMDggMTguNDE1M0MyMS4wMzc3IDE5LjE2ODYgMTkuODQ2OCAyMC4wNTgyIDE4Ljc2ODQgMjEuMDcxNUMxNi4zNzU1IDIzLjMxMzkgMTQuNTg5OCAyNi4wNjUzIDEzLjI2NzMgMjguNzkyOUMxMy4wMDcyIDI5LjMzMDQgMTIuMiAyOS4xNDAyIDEyLjIgMjguNTQyM1YxMi42ODI2QzEyLjIgOC45OTI0MiAxNS4xOTI0IDYgMTguODgyNiA2QzIyLjU3MjggNiAyNS41NjUyIDguOTkyNDIgMjUuNTY1MiAxMi42ODI2SDI1LjU2MzZaIiBmaWxsPSIjMDA3NUZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjIzM18yMzg3Ij4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
    urls: {
      android:
        "https://play.google.com/store/apps/details?id=com.portto.blocto",
      ios: "https://apps.apple.com/app/blocto/id1481181682",
    },
  };

  /**
   * Create a `BloctoWallet` instance
   * @param options - The `options` object includes the following properties
   *
   * ### clientId (recommended)
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### appId (recommended)
   * To get advanced features and support from Blocto, you can create an appId from [blocto dashboard](https://docs.blocto.app/blocto-sdk/register-app-id)
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to our [default chains](/react/react.thirdwebprovider#default-chains).
   *
   * ### dappMetadata (optional)
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { BloctoWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new BloctoWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   *
   * ### chain (optional)
   * The Network to connect the wallet to. Must be a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   */
  constructor(options?: WalletOptions<BloctoOptions>) {
    if (options?.chain && options.clientId) {
      options.chain = updateChainRPCs(options.chain, options.clientId);
    }

    super(BloctoWallet.id, options);
  }

  /**
   * @internal
   */
  protected async initConnector(): Promise<Connector> {
    const { BloctoConnector } = await import("../connectors/blocto");
    const bloctoConnector = new BloctoConnector({
      chains: this.chains,
      options: {
        appId: this.options?.appId,
        chainId: this.options?.chain?.chainId,
      },
    });

    this.connector = new WagmiAdapter(bloctoConnector);

    return this.connector;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      return await this.initConnector();
    }

    return Promise.resolve(this.connector);
  }
}
