export const authOptions = [
  "google",
  "facebook",
  "x",
  "discord",
  "farcaster",
  "telegram",
  "github",
  "twitch",
  "phone",
  "email",
  "guest",
  "apple",
  "coinbase",
  "line",
] as const;
export type AuthOption = (typeof authOptions)[number];

export type Ecosystem = {
  name: string;
  imageUrl?: string;
  id: string;
  slug: string;
  permission: "PARTNER_WHITELIST" | "ANYONE";
  authOptions: (typeof authOptions)[number][];
  url: string;
  status: "active" | "requested" | "paymentFailed";
  createdAt: string;
  updatedAt: string;
};

type PartnerPermission = "PROMPT_USER_V1" | "FULL_CONTROL_V1";
export type Partner = {
  id: string;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: [PartnerPermission];
  createdAt: string;
  updatedAt: string;
};
