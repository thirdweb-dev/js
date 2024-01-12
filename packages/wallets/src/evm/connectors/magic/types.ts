import { MagicSDKAdditionalConfiguration } from "@magic-sdk/provider";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";

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
