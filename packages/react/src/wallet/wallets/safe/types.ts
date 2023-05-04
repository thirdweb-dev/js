import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { SafeWallet } from "@thirdweb-dev/wallets";

export type SafeWalletConfig = {
  personalWallets?: ConfiguredWallet[];
};

export type SafeWalletObj = ConfiguredWallet<
  SafeWallet,
  Required<SafeWalletConfig>
>;

export type SafeConfiguredWallet = ConfiguredWallet<
  SafeWallet,
  Required<SafeWalletConfig>
>;
