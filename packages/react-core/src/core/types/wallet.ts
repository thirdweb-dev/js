import type {
  AbstractClientWallet,
  Chain,
  DAppMetaData,
} from "@thirdweb-dev/wallets";

// these are extra options provided by the react-core package
export type ExtraCoreWalletOptions = {
  chain: Chain;
};

export type WalletOptions = {
  chains: Chain[];
  walletId?: string;
  dappMetadata?: DAppMetaData;
} & ExtraCoreWalletOptions;

export type WalletInstance = AbstractClientWallet;

export type WalletClass<I extends WalletInstance = WalletInstance> = {
  id: string;
  new (options: WalletOptions): I;
  meta: (typeof AbstractClientWallet)["meta"];
};

export type WalletConfig<I extends WalletInstance = WalletInstance> = {
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

  /**
   * @returns true if the wallet is installed on the user's device
   */
  isInstalled?: () => boolean;

  /**
   * If the wallet requires a personal wallet to be connected, you must provide the list of personal wallets your wallet is using.
   *
   * specifying this adds the following features:
   * - Connect Wallet's Dropdown will render a button to "switch to personal wallet"
   * - Auto-connect will work by connecting to the last used personal wallet first, then connecting your wallet
   */
  personalWallets?: WalletConfig[];

  /**
   * whether to switch to `activeChain` after connecting to the wallet or just stay on the chain that wallet is already connected to
   * default - false
   * If it is set as `true`  - it will force the wallet to switch to `activeChain` after connecting to the wallet - this also includes autoconnecting when the user reopens the app.
   *
   * this can be jarring for the user, if your wallet opens a popup or requires user to manually switch to the chain from extension or app
   * @default false
   */
  autoSwitch?: boolean;
};

export type ConnectUIProps<I extends WalletInstance = WalletInstance> = {
  /**
   * close the connect wallet modal
   * @param reset reset Connect Wallet Modal to initial state, so that if it's opened again, it will start from the wallet-selection screen
   *
   * default: `true`
   */
  close: (reset?: boolean) => void;

  /**
   * indicates whether the connect wallet modal is open or not
   */
  isOpen: boolean;

  /**
   * open the connect wallet modal
   */
  open: () => void;

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
};
