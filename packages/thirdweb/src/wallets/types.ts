import type { Chain } from "../chains/types.js";

export type AppMetadata = {
  /**
   * the name of your app
   */
  name: string;
  /**
   * the url where your app is hosted
   */
  url?: string;
  /**
   * optional - a description of your app
   */
  description?: string;
  /**
   * optional - a url that points to a logo (or favicon) of your app
   */
  logoUrl?: string;
};

export type SocialAuthOption = "google" | "apple" | "facebook";

export type AuthOption = "email" | "phone" | "passkey" | SocialAuthOption;

export type DisconnectFn = () => Promise<void>;
export type SwitchChainFn = (chain: Chain) => Promise<void>;
