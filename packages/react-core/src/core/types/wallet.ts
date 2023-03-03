import { Chain as TWChain } from "@thirdweb-dev/chains";
import {
  AbstractBrowserWallet,
  AsyncStorage,
  DAppMetaData,
  TWConnector,
} from "@thirdweb-dev/wallets";
import { Chain } from "@wagmi/core";

export type WalletOptions = {
  chains?: Chain[];
  shouldAutoConnect?: boolean;
  coordinatorStorage: AsyncStorage;
  dappMetadata: DAppMetaData;
  theme?: "light" | "dark";
  // for device wallet
  chain: TWChain;
};

type SupportedWalletInstance = InstanceType<typeof AbstractBrowserWallet> & {
  connector?: TWConnector;
};

export type SupportedWallet = {
  id: string;
  new (options: WalletOptions): SupportedWalletInstance;
};
