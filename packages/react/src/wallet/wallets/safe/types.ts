import { WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWallet } from "@thirdweb-dev/wallets";

export type SafeWalletConfig = {
  personalWallets?: WalletConfig<any>[];
};

export type SafeWalletObj = WalletConfig<SafeWallet>;

export type SafeConfiguredWallet = WalletConfig<SafeWallet>;
