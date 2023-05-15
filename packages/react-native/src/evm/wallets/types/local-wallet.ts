import { WalletConfig } from "@thirdweb-dev/react-core";
import { LocalWallet } from "../wallets/LocalWallet";

export type LocalConfiguredWallet = WalletConfig<LocalWallet>;

export type LocalWalletInstance = LocalWallet;
