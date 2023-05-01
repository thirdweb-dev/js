import { metamaskWallet } from "../wallets/wallets/metamask-wallet";
import { rainbowWallet } from "../wallets/wallets/rainbow-wallet";

export const DEFAULT_WALLETS = [metamaskWallet(), rainbowWallet()];
