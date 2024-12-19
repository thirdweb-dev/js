import type * as ox__Authorization from "ox/Authorization";
import type { Address } from "../../../utils/address.js";

/**
 * An EIP-7702 authorization input object.
 *
 * @beta
 * @transaction
 */
export type Authorization = {
  address: Address;
  chainId?: number;
  nonce?: bigint;
};

/**
 * An EIP-7702 authorization object fully prepared and ready for signing.
 *
 * @beta
 * @transaction
 */
export type PreparedAuthorization = {
  address: Address;
  chainId: number;
  nonce: bigint;
};

/**
 * Represents a signed EIP-7702 authorization object.
 *
 * @beta
 * @transaction
 */
export type SignedAuthorization = ox__Authorization.ListSigned[number];
