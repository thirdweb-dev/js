export const ADMIN_ROLE = ["admin"] as const;

export const NFT_BASE_CONTRACT_ROLES = [
  "admin",
  "minter",
  "transfer",
  "metadata",
] as const;

export const MARKETPLACE_CONTRACT_ROLES = ["admin", "lister", "asset"] as const;

export const PACK_CONTRACT_ROLES = [
  "admin",
  "minter",
  "asset",
  "transfer",
] as const;

export const TOKEN_DROP_CONTRACT_ROLES = ["admin", "transfer"] as const;

export const MULTIWRAP_CONTRACT_ROLES = [
  "admin",
  "transfer",
  "minter",
  "unwrap",
  "asset",
] as const;
