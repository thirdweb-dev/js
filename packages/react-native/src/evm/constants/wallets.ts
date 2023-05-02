import { metamaskWallet } from "../wallets/wallets/metamask-wallet";
import { rainbowWallet } from "../wallets/wallets/rainbow-wallet";
import { trustWallet } from "../wallets/wallets/trust-wallet";

export const DEFAULT_WALLETS = [
  metamaskWallet(),
  rainbowWallet(),
  trustWallet(),
];
