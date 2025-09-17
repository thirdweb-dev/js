import type { Chain } from "../../../../../chains/types.js";
import type {
  Account,
  Wallet,
} from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../../wallets/types.js";
import type { SiweAuthOptions } from "../../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButton_connectModalOptions } from "../../../../core/hooks/connection/ConnectButtonProps.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";

/**
 * Connection options for the `SwapWidget` component
 *
 * @example
 * ```tsx
 * <SwapWidget client={client} connectOptions={{
 *    connectModal: {
 *      size: 'compact',
 *      title: "Sign in",
 *    }
 *  }}
 * />
 * ```
 */
export type SwapWidgetConnectOptions = {
  /**
   * Configurations for the `ConnectButton`'s Modal that is shown for connecting a wallet
   * Refer to the [`ConnectButton_connectModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_connectModalOptions) type for more details
   */
  connectModal?: ConnectButton_connectModalOptions;

  /**
   * Configure options for WalletConnect
   *
   * By default WalletConnect uses the thirdweb's default project id.
   * Setting your own project id is recommended.
   *
   * You can create a project id by signing up on [walletconnect.com](https://walletconnect.com/)
   */
  walletConnect?: {
    projectId?: string;
  };

  /**
   * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
   *
   * This allows to sponsor gas fees for your user's transaction using the thirdweb account abstraction infrastructure.
   *
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Array of wallets to show in Connect Modal. If not provided, default wallets will be used.
   */
  wallets?: Wallet[];
  /**
   * When the user has connected their wallet to your site, this configuration determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
   *
   * By default it is set to `{ timeout: 15000 }` meaning that autoConnect is enabled and if the autoConnection does not succeed within 15 seconds, it will be cancelled.
   *
   * If you want to disable autoConnect, set this prop to `false`.
   *
   * If you want to customize the timeout, you can assign an object with a `timeout` key to this prop.
   */
  autoConnect?:
    | {
        timeout: number;
      }
    | boolean;

  /**
   * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
   */
  appMetadata?: AppMetadata;

  /**
   * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
   *
   * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
   *
   * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
   * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
   *
   * The `ConnectButton` also shows a "Switch Network" button until the wallet is connected to the specified chain. Clicking on the "Switch Network" button triggers the wallet to switch to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * ```
   */
  chain?: Chain;

  /**
   * Array of chains that your app supports.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
   * If your app only works on a single blockchain, you should only specify the `chain` prop.
   *
   * Given list of chains will used in various ways:
   * - They will be displayed in the network selector in the `ConnectButton`'s details modal post connection
   * - They will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
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
  chains?: Chain[];

  /**
   * Wallets to show as recommended in the `ConnectButton`'s Modal
   */
  recommendedWallets?: Wallet[];

  /**
   * By default, ConnectButton modal shows a "All Wallets" button that shows a list of 500+ wallets.
   *
   * You can disable this button by setting `showAllWallets` prop to `false`
   */
  showAllWallets?: boolean;

  /**
   * Enable SIWE (Sign in with Ethererum) by passing an object of type `SiweAuthOptions` to
   * enforce the users to sign a message after connecting their wallet to authenticate themselves.
   *
   * Refer to the [`SiweAuthOptions`](https://portal.thirdweb.com/references/typescript/v5/SiweAuthOptions) for more details
   */
  auth?: SiweAuthOptions;
};

/**
 * @internal
 */
export type ActiveWalletInfo = {
  activeChain: Chain;
  activeWallet: Wallet;
  activeAccount: Account;
};

/**
 * @internal
 */
export type TokenSelection = {
  tokenAddress: string;
  chainId: number;
};

export type SwapPreparedQuote = Extract<
  BridgePrepareResult,
  { type: "buy" | "sell" }
>;
