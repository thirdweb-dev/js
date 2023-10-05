export const safeSlugToChainId = {
  eth: 1,
  matic: 137,
  avax: 43114,
  bnb: 56,
  oeth: 10,
  gor: 5,
  "base-gor": 84531,
} as const;

export const safeChainIdToSlug = {
  1: "eth",
  137: "matic",
  43114: "avax",
  56: "bnb",
  10: "oeth",
  5: "gor",
  84531: "base-gor",
} as const;
