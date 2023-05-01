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

export type Wallet<I extends WalletInstance = WalletInstance> = {
  id: string;
  meta: (typeof AbstractClientWallet)["meta"];
  create: (options: WalletOptions) => I;
  config?: {
    personalWallets?: Wallet[];
  };
};
