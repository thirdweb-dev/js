import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";

export type MagicLinkConfig = MagicLinkAdditionalOptions;

export type MagicLinkWallet = ConfiguredWallet<MagicLink, MagicLinkConfig>;
