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

export const socialAuthOptions = [
  "google",
  "apple",
  "facebook",
  "discord",
  "farcaster",
  "telegram",
] as const;
export type SocialAuthOption = (typeof socialAuthOptions)[number];

export type AuthOption =
  | "email"
  | "phone"
  | "passkey"
  | "siwe"
  | SocialAuthOption;

export type DisconnectFn = () => Promise<void>;
export type SwitchChainFn = (chain: Chain) => Promise<void>;
