import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { LruMap } from "../../utils/caching/lru.js";
import { type Hex, isHex, padHex } from "../../utils/encoding/hex.js";

/**
 * A map of all current thirdweb's smart contract roles
 */
export const roleMap = {
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
 * @extension PERMISSIONS
 */
export type ThirdwebContractRole = keyof typeof roleMap;

export const ALL_ROLES = /* @__PURE__ */ (() =>
  Object.keys(roleMap))() as ThirdwebContractRole[];

export function isThirdwebContractRole(
  role: string,
): role is ThirdwebContractRole {
  return role in roleMap;
}

export type RoleInput = ThirdwebContractRole | Hex | (string & {});

const roleCache = new LruMap<Hex>(128);

/**
 * Get a hex value of a smart contract role
 * You need the hex value to interact with the smart contracts.
 * @param role string
 * @returns hex value of the contract role
 *
 * @example
 * ```ts
 * const adminRoleHash = getRoleHash("admin"); // 0x0000000...000000
 * ```
 * @extension PERMISSIONS
 */
export function getRoleHash(role: RoleInput) {
  if (roleCache.has(role)) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's in the cache
    return roleCache.get(role)!;
  }
  const roleHash = (() => {
    // if it's hex we pass it through as is -- assume it's a role has already
    if (isHex(role)) {
      return role;
    }
    // if it's a known thirdweb role, we convert it to the role hash
    if (isThirdwebContractRole(role)) {
      if (role === "admin") {
        return padHex("0x", { size: 32 });
      }
      return keccakId(roleMap[role]);
    }

    // otherwise we assume it's some other role and we pass it to keccakId to compute the role hash
    return keccakId(role);
  })();
  roleCache.set(role, roleHash);
  return roleHash;
}
