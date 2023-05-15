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

export type ConfiguredWallet<
  I extends WalletInstance = WalletInstance,
  Config extends Record<string, any> | undefined = undefined,
> = {
  id: string;
  meta: (typeof AbstractClientWallet)["meta"];
  create: (options: WalletOptions) => I;
  connectUI?: React.FC<ConnectUIProps<I, Config>>;
  isInstalled?: () => boolean;
} & (Config extends undefined
  ? {}
  : {
      config: Config;
    });

export type ConnectUIProps<
  I extends WalletInstance = WalletInstance,
  Config extends Record<string, any> | undefined = undefined,
> = {
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
   * `ConfiguredWallet` object of your wallet
   *
   * you can use this to connect to your wallet
   *
   * ### 1. Using `useConnect` hook
   * ```ts
   *  const connect = useConnect();
   *
   *  // call this function to connect to your wallet
   *  async function handleConnect() {
   *    await connect(configuredWallet, options);
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
   *   const walletInstance = createWalletInstance();
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
  configuredWallet: ConfiguredWallet<I, Config>;
};
