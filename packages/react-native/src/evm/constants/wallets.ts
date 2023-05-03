import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { metamaskWallet } from "../wallets/wallets/metamask-wallet";
import { rainbowWallet } from "../wallets/wallets/rainbow-wallet";

export const DEFAULT_WALLETS: ConfiguredWallet[] = [
  metamaskWallet(),
  rainbowWallet(),
];
