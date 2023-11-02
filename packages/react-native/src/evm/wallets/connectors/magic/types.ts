import { MagicSDKAdditionalConfiguration } from "@magic-sdk/react-native-bare";
import { Chain } from "@thirdweb-dev/chains";
import { WalletOptions } from "@thirdweb-dev/wallets";

export interface MagicConnectorOptions {
  apiKey: string;
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
  chains?: Chain[];
  chainId?: number;
  email?: string;
  phoneNumber?: string;
}

export type MagicLinkOptions = Omit<
  WalletOptions<MagicConnectorOptions>,
  "clientId"
>;
