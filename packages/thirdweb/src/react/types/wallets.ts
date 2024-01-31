import type { ConnectionStatus } from "../../wallets/manager/index.js";
import { type Wallet } from "../../wallets/index.js";

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
  connect: (options?: {
    chainId?: number;
    silent?: boolean;
  }) => Promise<Wallet>;
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
   * providing the `personalWallets` ensures that autoconnect and ConnectWallet modal works properly for your wallet.
   * autoconnect will connect the last connected personal wallet first and then connect your wallet
   * ConnectWallet modal will reopen once the personal wallet is connected so that you can render UI for connecting your wallet as the next step
   */
  personalWallets?: WalletConfig[];

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
};

/**
 * @wallet
 */
export type ConnectUIProps = {
  walletConfig: WalletConfig;

  connect: (options?: {
    chainId?: number;
    silent?: boolean;
  }) => Promise<Wallet>;

  /**
   * temporarily hide the ConnectModal
   * This is useful when you want to open another modal and do not want to show the ConnectModal in the background
   */
  hide: () => void;

  /**
   * when the wallet is connected, call this function to indicate that the wallet is connected and it is safe to close the Modal
   */
  connected: (wallet: Wallet) => void;

  /**
   * indicates whether the connect wallet modal is open or not
   */
  isOpen: boolean;

  /**
   * show the hidden connect wallet modal again
   */
  show: () => void;

  /**
   * go back to the wallet selector screen in connect wallet modal
   */
  goBack: () => void;

  /**
   * theme of the connect wallet modal
   */
  theme: "dark" | "light";

  /**
   * selectionData passed from `selectUI`'s `onSelect` function
   */
  selectionData: any;

  /**
   * set selectionData
   */
  setSelectionData: (data: any) => void;

  /**
   * Array of supported wallets including this wallet.
   */
  wallets: WalletConfig[];

  /**
   * Size of the modal
   *
   * This is always `compact` on React Native
   */
  modalSize: "compact" | "wide";

  /**
   * Connected wallet instance
   * This is set by `connect` if connection succeeds or it can be set manually by using `setConnectedWallet`
   */
  activeWallet?: Wallet;

  /**
   * Address of the connected wallet instance
   */
  activeWalletAddress?: string;

  activeWalletConnectionStatus: ConnectionStatus;

  setActiveWalletConnectionStatus: (status: ConnectionStatus) => void;
};

/**
 * @wallet
 */
export type SelectUIProps = {
  connect: (options: { chainId?: number; silent?: boolean }) => Promise<Wallet>;

  /**
   * Call this function to "select" your wallet and render the screen for connecting the wallet
   * @param selectionData - selectionData to be passed to `connectUI`'s `selectionData` prop
   */
  onSelect: (selectionData: any) => void;

  /**
   * List of all supported wallets including your wallet.
   *
   * You can use this to conditionally render UI based on how many wallets are supported.
   * For example: You can render a larger UI if only one wallet (your wallet) is supported.
   */
  wallets: WalletConfig[];

  /**
   * theme of the connect wallet modal
   */
  theme: "dark" | "light";

  /**
   * Size of the modal
   *
   * This is always `compact` on React Native
   */
  modalSize: "compact" | "wide";

  /**
   * Set a wallet instance as connected in thirdweb context
   * This is only relevant if you are manually creating wallet instance and calling the `wallet.connect` method. If you are using the `connect` function, this is done automatically.
   */
  connected: (wallet: Wallet) => void;

  /**
   * Connected wallet instance
   * This is set by `connect` if connection succeeds or it can be set manually by using `setConnectedWallet`
   */
  activeWallet?: Wallet;

  /**
   * Address of the connected wallet instance
   */
  activeWalletAddress?: string;

  activeWalletConnectionStatus: ConnectionStatus;

  setActiveWalletConnectionStatus: (status: ConnectionStatus) => void;
};
