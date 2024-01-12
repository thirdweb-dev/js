import { WalletConfig } from "@thirdweb-dev/react-core";
import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";

type MagicLinkConfig = MagicLinkAdditionalOptions;

export type ConfiguredMagicLinkWallet = WalletConfig<MagicLink>;
