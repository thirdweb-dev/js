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

export type Partner = {
  id: string;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: ["PROMPT_USER_V1" | "FULL_CONTROL_V1"];
  createdAt: string;
  updatedAt: string;
};
