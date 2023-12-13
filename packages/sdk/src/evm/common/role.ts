import { type BytesLike, utils } from "ethers";

/**
 *
 * @internal
 */
const roleMap = {
  admin: "",
  transfer: "TRANSFER_ROLE",
  minter: "MINTER_ROLE",
  pauser: "PAUSER_ROLE",
  lister: "LISTER_ROLE",
  asset: "ASSET_ROLE",
  unwrap: "UNWRAP_ROLE",
  factory: "FACTORY_ROLE",
  signer: "SIGNER_ROLE",
  metadata: "METADATA_ROLE",
  revoke: "REVOKE_ROLE",
  migration: "MIGRATION_ROLE",
} as const;

/**
 * @public
 */
export type Role = keyof typeof roleMap;

/**
 * @public
 */
export const ALL_ROLES = /* @__PURE__ */ (() =>
  Object.keys(roleMap))() as Role[];

/**
 * @internal
 */
export function getRoleHash(role: Role): BytesLike {
  if (role === "admin") {
    return utils.hexZeroPad([0], 32);
  }
  return utils.id(roleMap[role]);
}
