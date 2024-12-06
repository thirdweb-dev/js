export const authOptions = [
  "email",
  "phone",
  "passkey",
  "siwe",
  "guest",
  "google",
  "facebook",
  "x",
  "discord",
  "farcaster",
  "telegram",
  "github",
  "twitch",
  "steam",
  "apple",
  "coinbase",
  "line",
] as const;

export type Ecosystem = {
  name: string;
  imageUrl?: string;
  id: string;
  slug: string;
  permission: "PARTNER_WHITELIST" | "ANYONE";
  authOptions: (typeof authOptions)[number][];
  customAuthOptions?: {
    authEndpoint?: {
      url: string;
      headers?: { key: string; value: string }[];
    };
    jwt?: {
      jwksUri: string;
      aud: string;
    };
  } | null;
  smartAccountOptions?: {
    defaultChainId: number;
    sponsorGas: boolean;
    accountFactoryAddress: string;
  } | null;
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
