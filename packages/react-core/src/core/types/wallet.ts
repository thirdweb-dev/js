import type {
  AbstractBrowserWallet,
  Chain,
  DAppMetaData,
} from "@thirdweb-dev/wallets";

// these are extra options provided by the react-core package
export type ExtraCoreWalletOptions = {
  chain: Chain;
};

export type WalletOptions = {
  chains: Chain[];
  shouldAutoConnect?: boolean;
  walletId?: string;
  dappMetadata: DAppMetaData;
} & ExtraCoreWalletOptions;

export type WalletInstance = InstanceType<typeof AbstractBrowserWallet>;

export type WalletClass<I extends WalletInstance = WalletInstance> = {
  id: string;
  new (options: WalletOptions): I;
  meta: (typeof AbstractBrowserWallet)["meta"];
};

export type Wallet<I extends WalletInstance = WalletInstance> = {
  id: string;
  meta: (typeof AbstractBrowserWallet)["meta"];
  create: (options: WalletOptions) => I;
};
