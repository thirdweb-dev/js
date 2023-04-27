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
  emailLogin?: boolean;
  smsLogin?: boolean;
  // oauthOptions?: {
  //   providers: OAuthProvider[];
  //   callbackUrl?: string;
  // };
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration<
    string,
    OAuthExtension[]
  >;
}

export interface MagicConnectorBaseOptions {
  apiKey: string;
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
}

export interface UserDetails {
  email: string;
  phoneNumber: string;
  oauthProvider: OAuthProvider;
}
