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

export type WalletInstance = InstanceType<typeof AbstractClientWallet>;

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
  connectUI?: React.FC<ConnectUIProps>;
  isInstalled?: () => boolean;
} & (Config extends undefined
  ? {}
  : {
      config: Config;
    });

export type ConnectUIProps = {
  /**
   * call this function when wallet is connected
   */
  onConnect: () => void;

  /**
   * hide the Connect Wallet Modal but don't close it
   */
  hideModal: () => void;

  /**
   * Modal is open but hidden
   */
  isModalHidden: boolean;

  /**
   * show the hidden Connect Wallet Modal
   */
  showModal: () => void;

  /**
   * go back to the wallet selector screen
   */
  goBack: () => void;

  /**
   * show the UI for connecting to given wallet
   */
  selectWallet: (wallet: ConfiguredWallet) => void;

  /**
   * Manually create a wallet instance instead of using `useConnect()` hook
   */
  createInstance: (wallet: ConfiguredWallet) => WalletInstance;

  /**
   * Declare the wallet instance as the "connected". This requires that you manually create the wallet instance and connect it.
   */
  setConnectedWallet: (walletInstance: WalletInstance) => void;

  /**
   * Set a wrapper wallet
   */
  setWrapperWallet: (configuredWallet: ConfiguredWallet | undefined) => void;

  onCloseModal: () => void;
};
