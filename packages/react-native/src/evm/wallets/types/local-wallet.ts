import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { LocalWalletNative } from "../wallets/LocalWallet";

export type LocalConfiguredWallet = ConfiguredWallet<LocalWalletNative>;

export type LocalWalletInstance = LocalWalletNative;
