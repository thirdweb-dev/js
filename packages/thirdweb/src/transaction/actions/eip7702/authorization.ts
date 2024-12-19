import type * as ox__Authorization from "ox/Authorization";

/**
 * Represents an EIP-7702 authorization object prior to being signed.
 *
 * @beta
 * @transaction
 */
export type Authorization = ox__Authorization.List<false>[number];

/**
 * Represents a signed EIP-7702 authorization object.
 *
 * @beta
 * @transaction
 */
export type SignedAuthorization = ox__Authorization.ListSigned[number];
