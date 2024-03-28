import { WalletConfig } from "@thirdweb-dev/react-core";
import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";

export type MagicLinkConfig = MagicLinkAdditionalOptions;

export type ConfiguredMagicLinkWallet = WalletConfig<MagicLink>;
