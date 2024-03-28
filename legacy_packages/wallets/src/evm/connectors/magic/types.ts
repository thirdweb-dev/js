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
}

export interface MagicAuthOptions extends MagicOptions {
  /**
   * enable email login for the Magic Auth.
   *
   * By default it is set to `true`
   */
  emailLogin?: boolean;
  /**
   * enable sms login for the Magic Auth.
   *
   * By default it is set to `true`
   */
  smsLogin?: boolean;
  /**
   * Specify whether to use the Magic Auth or Magic Connect.
   *
   * By default it is set to `"auth"`
   */
  type?: "auth" | "connect";

  oauthOptions?: {
    providers: OAuthProvider[];
    redirectURI?: string;
  };
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
   *
   * By default it is set to `"auth"`
   */
  type?: "auth" | "connect";
}

export interface UserDetails {
  email: string;
  phoneNumber: string;
  oauthProvider: OAuthProvider;
}
