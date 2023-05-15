import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWallet } from "@thirdweb-dev/wallets";

export type SafeWalletConfig = {
  personalWallets?: WalletConfig<any, any>[];
};

export type SafeWalletObj = WalletConfig<
  SafeWallet,
  Required<SafeWalletConfig>
>;

export type SafeConfiguredWallet = WalletConfig<
  SafeWallet,
  Required<SafeWalletConfig>
>;
