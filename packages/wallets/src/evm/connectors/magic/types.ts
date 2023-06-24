import type { Chain } from "@thirdweb-dev/chains";
import { MagicSDKAdditionalConfiguration } from "@magic-sdk/provider";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";

export type MagicWalletAdditionalOptions = {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
};

export interface MagicWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
}

export interface MagicWalletConnectionArgs {}

export interface MagicOptions {
  apiKey: string;
  // accentColor?: string;
  // isDarkMode?: boolean;
  // customLogo?: string;
  // customHeaderText?: string;
}

export interface MagicAuthOptions extends MagicOptions {
  /**
   * enable email login for the Magic Auth.
   * @default true
   */
  emailLogin?: boolean;
  /**
   * enable sms login for the Magic Auth.
   * @default true
   */
  smsLogin?: boolean;
  /**
   * Specify whether to use the Magic Auth or Magic Connect.
   * @default "auth"
   */
  type?: "auth" | "connect";

  // oauthOptions?: {
  //   providers: OAuthProvider[];
  //   callbackUrl?: string;
  // };
  magicSdkConfiguration?: Omit<
    MagicSDKAdditionalConfiguration<string, OAuthExtension[]>,
    "extensions" | "network"
  >;
}

export interface MagicConnectorBaseOptions {
  apiKey: string;
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
  /**
   * Specify whether to use the Magic Auth or Magic Connect.
   * @default "auth"
   */
  type?: "auth" | "connect";
}

export interface UserDetails {
  email: string;
  phoneNumber: string;
  oauthProvider: OAuthProvider;
}
