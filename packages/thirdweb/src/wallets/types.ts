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
  "line",
  "x",
  "coinbase",
  "farcaster",
  "telegram",
  "github",
  "twitch",
  "steam",
] as const;
export type SocialAuthOption = (typeof socialAuthOptions)[number];
export type OAuthOption = SocialAuthOption | "guest";

export const authOptions = [
  ...socialAuthOptions,
  "guest",
  "backend",
  "email",
  "phone",
  "passkey",
  "wallet",
] as const;
export type AuthOption = (typeof authOptions)[number];

export type DisconnectFn = () => Promise<void>;
export type SwitchChainFn = (chain: Chain) => Promise<void>;
