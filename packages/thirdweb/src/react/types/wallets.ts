import type { Chain } from "../../chains/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { DAppMetaData } from "../../wallets/types.js";

/**
 * @wallet
 */
export type WalletConfig = {
  category?: "socialLogin" | "walletLogin";

  metadata: {
    id: string;
    name: string;
    iconUrl: string;
  };

  create: (options: {
    client: ThirdwebClient;
    dappMetadata: DAppMetaData;
  }) => Wallet;

  /**
   * UI for connecting wallet
   */
  connectUI?: React.FC<ConnectUIProps>;

  /**
   * UI for selecting wallet - this UI is rendered in the wallet selection screen
   */
  selectUI?: React.FC<SelectUIProps>;

  isInstalled?: () => boolean;
  /**
   * An array of `WalletConfig` that users can use as a personal wallet to connect to your wallet
   *
   * This is only required if your wallet requires a personal wallet to be connected such as a Safe Wallet or Smart Wallet
   *
   * providing the `personalWallets` ensures that auto connect and ConnectWallet modal works properly for your wallet.
   * auto-connect will connect the last connected personal wallet first and then connect your wallet
   * ConnectWallet modal will reopen once the personal wallet is connected so that you can render UI for connecting your wallet as the next step
   */
  // personalWallets?: WalletConfig[];

  /**
   * If true, this wallet will be tagged as "recommended" in ConnectWallet Modal and will be shown at the top of the list
   *
   * By default is set to `false`
   */
  recommended?: boolean;

  /**
   * If the wallet can sign transactions without user interaction, set this to true.
   *
   * By default is set to `false`
   */
  isHeadless?: boolean;

  /**
   * An array of `WalletConfig` that users can use as a personal wallet to connect to your wallet
   *
   * This is only required if your wallet requires a personal wallet to be connected such as a Safe Wallet or Smart Wallet
   *
   * providing the `personalWalletConfigs` ensures that auto connect will connect the last connected personal wallet first and then connect this wallet
   */
  personalWalletConfigs?: WalletConfig[];
};

export type ScreenConfig = {
  /**
   * Hide or show the Modal that the screen is rendered in. This is useful if you want to open up another Modal as part of the wallet connection process and want to hide the current Modal to avoid showing multiple Modals at the same time
   *
   * This is ignored when the screen is not being rendered in a Modal and is directly embedded in the app
   */
  setModalVisibility: (isVisible: boolean) => void;

  /**
   * theme of the connect wallet modal
   */
  theme: "dark" | "light";

  /**
   * Size of the modal
   *
   * This is always `compact` on React Native
   */
  size: "compact" | "wide";

  /**
   * Go back to the the main screen in Modal. You can use this to render a back button in wallet connection UI
   *
   * This function is `undefined` if there is no previous screen to go back to. If it is `undefined`, you should not render a back button in your UI
   *
   * It is `undefined` when `wallets` prop of `ThirdwebProvider` is an array with only one wallet.
   * In that case the Modal does not show initial screen with list of wallets and directly shows the `connectUI` of the wallet directly - thus there is no screen to go back to
   */
  goBack?: () => void;
};

/**
 * @wallet
 */
export type ConnectUIProps = {
  /**
   * The wallet config object of the wallet
   * You can use this to use the wallet's properties / methods like `metadata`, `create`, `isInstalled` etc in your UI
   */
  walletConfig: WalletConfig;

  /**
   * Information about the screen that the wallet's UI and functions to control certain aspects of the screen
   */
  screenConfig: ScreenConfig;

  /**
   * when wallet connection is complete, call the `complete` function with the `wallet` instance
   */
  done: (wallet: Wallet) => void;

  /**
   * Chain Id to connect the wallet to
   */
  chain?: Chain;

  /**
   * List of all chains supported by the app
   */
  chains?: Chain[];

  /**
   * Create a wallet instance
   * Calling this function uses calls the `WalletConfig.create` method with the required options
   */
  createInstance: () => Wallet;
};

/**
 * @wallet
 */
export type SelectUIProps = {
  /**
   * Call this function to "select" your wallet and move to next step of showing the "connectUI"
   */
  select: () => void;

  /**
   * Information about the screen that the wallet's UI and functions to control certain aspects of the screen
   */
  screenConfig: ScreenConfig;

  /**
   * This is true if there are no other wallets to select from and this wallet is the only option
   */
  isSingularOption: boolean;
};
