import { BytesLike, ethers } from "ethers";

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
} as const;

/**
 * @public
 */
export type Role = keyof typeof roleMap;

/**
 * @public
 */
export const ALL_ROLES = Object.keys(roleMap) as Role[];

/**
 * @internal
 */
export function getRoleHash(role: Role): BytesLike {
  if (role === "admin") {
    return ethers.utils.hexZeroPad([0], 32);
  }
  return ethers.utils.id(roleMap[role]);
}
