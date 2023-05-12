import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { LocalWallet } from "../wallets/local-wallet";

export type LocalConfiguredWallet = ConfiguredWallet<LocalWallet>;

export type LocalWalletInstance = LocalWallet;
