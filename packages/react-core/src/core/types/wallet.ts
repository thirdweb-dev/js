import type {
  AbstractBrowserWallet,
  AsyncStorage,
  Chain,
  DAppMetaData,
  TWConnector,
} from "@thirdweb-dev/wallets";

// these are extra options provided by the react-core package
export type ExtraCoreWalletOptions = {
  theme?: "light" | "dark";
  // for device wallet
  chain: Chain;
};

export type WalletOptions = {
  chains?: Chain[];
  shouldAutoConnect?: boolean;
  walletId?: string;
  coordinatorStorage: AsyncStorage;
  dappMetadata: DAppMetaData;
} & ExtraCoreWalletOptions;

export type SupportedWalletInstance = InstanceType<
  typeof AbstractBrowserWallet
> & {
  connector?: TWConnector;
};

export type SupportedWallet<
  X extends SupportedWalletInstance = SupportedWalletInstance,
> = {
  id: string;
  new (options: WalletOptions): X;
  meta: (typeof AbstractBrowserWallet)["meta"];
};
