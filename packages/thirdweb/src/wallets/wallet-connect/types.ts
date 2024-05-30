import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { AppMetadata } from "../types.js";

type EthereumProviderOptions = Parameters<(typeof EthereumProvider)["init"]>[0];

type WalletConnectQRCodeModalOptions = Pick<
  NonNullable<EthereumProviderOptions["qrModalOptions"]>,
  | "themeMode"
  | "themeVariables"
  | "desktopWallets"
  | "enableExplorer"
  | "explorerRecommendedWalletIds"
  | "explorerExcludedWalletIds"
  | "mobileWallets"
  | "privacyPolicyUrl"
  | "termsOfServiceUrl"
  | "walletImages"
>;

export type WalletConnectConfig = {
  /**
   * Your project’s unique identifier that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * Metadata of the dApp that will be passed to connected wallet.
   *
   * Some wallets may display this information to the user.
   *
   * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
   *
   * ```ts
   * {
   *   name: "thirdweb powered dApp",
   *   url: "https://thirdweb.com",
   *   description: "thirdweb powered dApp",
   *   logoUrl: "https://thirdweb.com/favicon.ico",
   * };
   * ```
   */
  appMetadata?: AppMetadata;
};

export type WCConnectOptions = {
  /**
   * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
   *
   * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
   *
   * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
   * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * @example
   * ```tsx
   * import { defineChain } from "thirdweb/react";
   *
   * const polygon = defineChain({
   *  id: 137,
   * });
   *
   * await wallet.connect({ chain: polygon });
   * ```
   */
  chain?: Chain;

  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  walletConnect?: Prettify<
    WalletConnectConfig & {
      /**
       * Array of chains that your app supports.
       *
       * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
       * If your app only works on a single blockchain, you should only specify the `chain` prop.
       *
       * They will be sent to wallet at the time of connection if the wallet so that users can switch between the chains post connection easily
       *
       * ```tsx
       * await wallet.connect({
       *  chain: polygon,
       *  optionalChains: [polygon, ethereum],
       * })
       * ```
       *
       * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
       * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
       *
       * ```tsx
       * import { defineChain } from "thirdweb/react";
       *
       * const polygon = defineChain({
       *   id: 137,
       * });
       * ```
       */
      optionalChains?: Chain[];
      /**
       * Whether or not the WalletConnect's official QR Code Modal should be opened.
       * You have to set this to `true` if you are not rendering the QR Code Modal yourself.
       * ```ts
       * await wallet.connect({ showQrModal: true });
       * ```
       *
       * If you are rendering the QR Code Modal yourself, you can set this to `false` and pass the `onDisplayUri` prop to get the URI to render a custom QR Code Modal.
       * ```tsx
       * await wallet.connect({
       *  showQrModal: false,
       *  onDisplayUri: (uri) => {
       *    // render the QR Code Modal with the uri
       *    // when the user scans the QR Code, the promise returned by `wallet.connect` will be resolved
       *  }
       * })
       * ```
       */
      showQrModal?: boolean;
      /**
       * The `pairingTopic` to pass to WalletConnect's `EthereumProvider`
       */
      pairingTopic?: string;
      /**
       * Options for Configuring the QR Code Modal appearance and behavior.
       * This is only relevant if you are opening the official WalletConnect QR Code Modal by setting `showQrModal` to `true`.
       */
      qrModalOptions?: WalletConnectQRCodeModalOptions;
      /**
       * If you do not want to open the official WalletConnect Modal and want to render the QR Code Modal yourself, you can set `showQrModal` to `false`
       * and pass the `onDisplayUri` prop to get the URI to render a custom QR Code Modal.
       *
       * ```tsx
       * await wallet.connect({
       *  showQrModal: false,
       *  onDisplayUri: (uri) => {
       *    // render the QR Code Modal with the uri
       *    // when the user scans the QR Code, the promise returned by `wallet.connect` will be resolved
       *  }
       * })
       * ```
       */
      onDisplayUri?: (uri: string) => void;
    }
  >;
};

export type WCAutoConnectOptions = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  savedConnectParams?: SavedConnectParams;

  chain?: Chain;
};

type SavedConnectParams = {
  optionalChains?: Chain[];
  chain: Chain;
  pairingTopic?: string;
};

export type WalletConnectMetadata = {
  name: string;
  url: string;
  description: string;
  icons: string[];
};
