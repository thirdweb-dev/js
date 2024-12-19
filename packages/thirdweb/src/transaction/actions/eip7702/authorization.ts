import type * as ox__Authorization from "ox/Authorization";
import type { Address } from "../../../utils/address.js";

/**
 * Represents an EIP-7702 authorization object prior to being signed.
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
 * Represents a signed EIP-7702 authorization object.
 *
 * @beta
 * @transaction
 */
export type SignedAuthorization = ox__Authorization.ListSigned[number];
