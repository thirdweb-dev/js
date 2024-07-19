export type Ecosystem = {
  name: string;
  imageUrl?: string;
  id: string;
  slug: string;
  permission: "PARTNER_WHITELIST" | "ANYONE";
  authOptions: unknown;
  url: string;
  status: "active" | "requested" | "paymentFailed";
  createdAt: string;
  updatedAt: string;
};

export type PartnerPermission = "PROMPT_USER_V1" | "FULL_CONTROL_V1";
export type Partner = {
  id: string;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: [PartnerPermission];
  createdAt: string;
  updatedAt: string;
};
