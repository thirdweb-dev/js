import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { LocalWallet } from "../wallets/LocalWallet";

export type LocalConfiguredWallet = ConfiguredWallet<LocalWallet>;

export type LocalWalletInstance = LocalWallet;
