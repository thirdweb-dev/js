import type { QueryClientProviderProps } from "../../core/providers/query-client";
import type { ThirdwebAuthConfig } from "../contexts/thirdweb-auth";
import type { Chain } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { IThirdwebStorage } from "@thirdweb-dev/storage";
import type { Signer } from "ethers";

export interface ThirdwebSDKProviderProps<TChains extends Chain[]>
  extends QueryClientProviderProps {
  /**
   * An array of chains supported by your app.
   * There are 1000+ chains available in the `@thirdweb-dev/chains` package. You can import the chain you want and pass it to the `supportedChains` prop in an array.
   *
   * If not provided, it will default to the default supported chains supported by the thirdweb SDK.
   *
   * @example
   * ```tsx
   * import { Ethereum, Polygon } from "@thirdweb-dev/chains";
   *
   * function Example() {
   *  return (
   *    <ThirdwebSDKProvider supportedChains={[ Ethereum, Polygon ]} activeChain={Ethereum}>
   *       <App />
   *    </ThirdwebSDKProvider>
   *  )
   * }
   * ```
   */
  supportedChains?: TChains;

  /**
   * A signer is an abstraction of an Ethereum Account, which can be used to sign messages and initiate transactions.
   *
   * Since the ThirdwebSDKProvider is used when you want to provide your own wallet connection logic, you will need to provide a signer prop to inform the SDK of the wallet you want to use to sign transactions.
   *
   * Libraries such as ethers.js, web3.js, wagmi, etc. all provide ways to get a signer.
   *
   * To use this signer with the SDK, pass it to the `signer` prop. If the signer is connected, the SDK will use this wallet to sign transactions for all write operations on the blockchain.
   */
  signer?: Signer;

  /**
   * The thirdweb SDK Options to pass to the thirdweb SDK which includes Gas settings, gasless transactions, RPC configuration, and more.
   *
   * This Overrides any of the default values for the SDK. If not provided, it uses sensible defaults.
   */
  sdkOptions?: Omit<SDKOptions, "chains">;

  /**
   * Override the default [Storage](https://portal.thirdweb.com/infrastructure/storage/overview) interface used by the SDK.
   *
   * It allows you to create an instance of `ThirdwebStorage` with your own customized config, and pass it to the SDK.
   *
   * *This requires the `@thirdweb-dev/storage` package to be installed.*
   *
   * @example
   * ```tsx
   * import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
   * import {
   *   ThirdwebStorage,
   *   StorageDownloader,
   *   IpfsUploader,
   * } from "@thirdweb-dev/storage";
   *
   * // Configure a custom ThirdwebStorage instance
   * const gatewayUrls = {
   *   "ipfs://": [
   *     "https://gateway.ipfscdn.io/ipfs/",
   *     "https://cloudflare-ipfs.com/ipfs/",
   *     "https://ipfs.io/ipfs/",
   *   ],
   * };
   * const downloader = new StorageDownloader();
   * const uploader = new IpfsUploader();
   * const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls });
   *
   * // Provide the custom storage instance to the SDK
   * function MyApp() {
   *   return (
   *     <ThirdwebSDKProvider
   *       storageInterface={storage}
   *     >
   *       <YourApp />
   *     </ThirdwebSDKProvider>
   *   );
   * }
   * ```
   */
  storageInterface?: IThirdwebStorage;

  /**
   * The configuration object for setting up [Auth](https://portal.thirdweb.com/wallets/auth); allowing users to sign in with their wallet.
   */
  authConfig?: ThirdwebAuthConfig;

  /**
   * The activeChain prop determines which chain you want your app to be operating on.
   *
   * There are 1000+ chains available in the `@thirdweb-dev/chains` package. Import the chain you want and pass it to the `activeChain` prop.
   *
   * You can override the imported object or pass a custom chain object with required properties.
   */
  activeChain?:
    | TChains[number]["chainId"]
    // allow number as well but autocomplete will only show chainId
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (number & {})
    | TChains[number]["slug"]
    // allow string as well but autocomplete will only show chain slug
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (string & {})
    | Chain;

  /**
   * The clientId prop is required to use the thirdweb infrastructure services with the SDK.
   *
   * You can get a client ID by creating an API key on [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys)
   */
  clientId?: string;

  /**
   * secretKey for thirdweb services
   * This is only required if server side rendering is being used.
   */
  secretKey?: string;
}
