import { keccak256 } from "../../hashing/keccak256.js";
import { toBytes } from "../to-bytes.js";

/**
 * Generates a 256-bit hash of a given role string in bytes form using the keccak256 algorithm.
 *
 * @param {string} role - The role string to be converted into bytes and hashed.
 * @returns {`0x${string}`} A 256-bit hash of the input role as a byte array.
 * @example
 *   const AdminRole = roleBytes("ADMIN_ROLE");
 */
export const roleBytes = (role: string): `0x${string}` => {
  return keccak256(toBytes(role));
}
