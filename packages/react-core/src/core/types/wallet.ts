import type { AbstractClientWallet, Chain } from "@thirdweb-dev/wallets";
import { WalletOptions as WalletOptions_ } from "@thirdweb-dev/wallets";

// these are extra options provided by the react-core package
export type ExtraCoreWalletOptions = {
  chain: Chain;
};

export type WalletOptions = WalletOptions_<ExtraCoreWalletOptions>;

export type WalletInstance = AbstractClientWallet;

export type WalletClass<I extends WalletInstance = WalletInstance> = {
  id: string;
  new (options: WalletOptions): I;
  meta: (typeof AbstractClientWallet)["meta"];
};

export type WalletConfig<I extends WalletInstance = WalletInstance> = {
  category?: "socialLogin" | "walletLogin";
  id: string;
  meta: (typeof AbstractClientWallet)["meta"];
  create: (options: WalletOptions) => I;
  /**
   * UI for connecting wallet
   */
  connectUI?: React.FC<ConnectUIProps<I>>;
  /**
   * UI for selecting wallet - this UI is rendered in the wallet selection screen
   */
  selectUI?: React.FC<SelectUIProps<I>>;
  isInstalled?: () => boolean;
  /**
   * An array of `WalletConfig` that users can use as a personal wallet to connect to your wallet
   *
   * This is only required if your wallet requires a personal wallet to be connected such as a Safe Wallet or Smart Wallet
   *
   * providing the `personalWallets` ensures that autoconnect and ConnectWallet modal works properly for your wallet.
   * * autoconnect will connect the last connected personal wallet first and then connect your wallet
   * * ConnectWallet modal will reopen once the personal wallet is connected so that you can render UI for connecting your wallet as the next step
   */
  personalWallets?: WalletConfig[];

  /**
   * If true, this wallet will be tagged as "recommended" in ConnectWallet Modal and will be shown at the top of the list
   * @default false
   */
  recommended?: boolean;

  /**
   * If the wallet can sign transactions without user interaction, set this to true.
   * @default false
   */
  isHeadless?: boolean;
};

export type ConnectUIProps<I extends WalletInstance = WalletInstance> = {
  /**
   * temporarily hide the ConnectModal
   * This is useful when you want to open another modal and do not want to show the ConnectModal in the background
   */
  hide: () => void;

  /**
   * when the wallet is connected, call this function to indicate that the wallet is connected and it is safe to close the Modal
   */
  connected: () => void;

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
   * `WalletConfig` object of your wallet
   *
   * you can use this to connect to your wallet
   *
   * ### 1. Using `useConnect` hook
   * ```ts
   *  const connect = useConnect();
   *
   *  // call this function to connect to your wallet
   *  async function handleConnect() {
   *    await connect(walletConfig, options);
   *  }
   *
   * ```
   *
   * OR
   *
   * ### 2. Manually creating wallet instance and connecting
   * ```ts
   * const createWalletInstance = useCreateWalletInstance();
   * const setConnectedWallet = useSetConnectedWallet();
   * const setConnectionStatus = useSetConnectionStatus();
   *
   * // call this function to connect to your wallet
   * async function handleConnect() {
   *   // create instance
   *   const walletInstance = createWalletInstance(walletConfig);
   *   // connect wallet
   *   setConnectionStatus('connecting);
   *   try {
   *     await walletInstance.connect(options);
   *     // set connected wallet
   *     setConnectedWallet(walletInstance);
   *   } catch {
   *     setConnectionStatus('disconnected');
   *  }
   * }
   * ```
   */
  walletConfig: WalletConfig<I>;

  /**
   * selectionData passed from `selectUI`'s `onSelect` function
   */
  selectionData: any;

  /**
   * set selectionData
   * @returns
   */
  setSelectionData: (data: any) => void;

  /**
   * List of all supported wallets including your wallet.
   */
  supportedWallets: WalletConfig[];

  /**
   * Size of the modal
   *
   * This is always `compact` on React Native
   */
  modalSize: "compact" | "wide";

  /**
   * Called when the wallet is connected but it's
   * part of another wallet's connection flow.
   * @param walleInstance the instance of the connected wallet
   */
  onLocallyConnected?: (walleInstance: WalletInstance) => void;
};

export type SelectUIProps<I extends WalletInstance = WalletInstance> = {
  /**
   * Call this function to "select" your wallet and render the screen for connecting the wallet
   * @param selectionData - selectionData to be passed to `connectUI`'s `selectionData` prop
   * @returns
   */
  onSelect: (selectionData: any) => void;

  /**
   * `WalletConfig` object of your wallet
   *
   * you can use this get metadata of your wallet by doing `walletConfig.meta`
   */
  walletConfig: WalletConfig<I>;

  /**
   * List of all supported wallets including your wallet.
   *
   * You can use this to conditionally render UI based on how many wallets are supported.
   * For example: You can render a larger UI if only one wallet (your wallet) is supported.
   */
  supportedWallets: WalletConfig[];

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
};
