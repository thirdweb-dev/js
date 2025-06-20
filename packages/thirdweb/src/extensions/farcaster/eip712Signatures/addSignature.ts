import type { Address } from "abitype";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { KEY_GATEWAY_ADDRESS } from "../constants.js";

const KEY_GATEWAY_EIP_712_DOMAIN = {
  chainId: 10,
  name: "Farcaster KeyGateway",
  verifyingContract: KEY_GATEWAY_ADDRESS,
  version: "1",
} as const;

const KEY_GATEWAY_ADD_TYPE = [
  { name: "owner", type: "address" },
  { name: "keyType", type: "uint32" },
  { name: "key", type: "bytes" },
  { name: "metadataType", type: "uint8" },
  { name: "metadata", type: "bytes" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
] as const;

const KEY_GATEWAY_EIP_712_TYPES = {
  domain: KEY_GATEWAY_EIP_712_DOMAIN,
  types: { Add: KEY_GATEWAY_ADD_TYPE },
} as const;

/**
 * @extension FARCASTER
 */
export type AddMessage = {
  /** FID owner address */
  owner: Address;
  /** Key type. The only currently supported key type is 1, for EdDSA signers. */
  keyType: number;
  /** Public key to register onchain */
  key: Hex;
  /** Metadata type. The only currently supported metadata type is 1. */
  metadataType: number;
  /** ABI-encoded SignedKeyRequestMetadata struct */
  metadata: Hex;
  /** KeyGateway nonce for signer address */
  nonce: bigint;
  /** Unix timestamp when this message expires */
  deadline: bigint;
};

/**
 * @extension FARCASTER
 */
export type SignAddOptions = {
  account: Account;
  message: AddMessage;
};

/**
 * Prepares the data required for signing an Add message according to EIP-712.
 * @param message - The AddMessage object containing the message to be signed.
 * @returns The data object structured according to EIP-712, ready for signing.
 * @extension FARCASTER
 * @example
 * ```typescript
 * const message: AddMessage = {
 *   owner: "0xYourAddress",
 *   keyType: 1,
 *   key: "0xYourPublicKey",
 *   metadataType: 1,
 *   metadata: "0xYourMetadata",
 *   nonce: BigInt("YourNonce"),
 *   deadline: BigInt("YourDeadline"),
 * };
 *
 * const data = getAddData(message);
 * ```
 */
export function getAddData(message: AddMessage) {
  return {
    ...KEY_GATEWAY_EIP_712_TYPES,
    message,
    primaryType: "Add" as const,
  };
}

/**
 * Signs an Add message using the account's signTypedData method.
 * @param options - The options for signing the Add message.
 * @returns A promise that resolves to the signature of the Add message.
 * @extension FARCASTER
 * @example
 * ```typescript
 * const signedMessage = await signAdd({
 *   account: yourAccount,
 *   message: yourAddMessage,
 * });
 * ```
 */
export async function signAdd(options: SignAddOptions): Promise<Hex> {
  const data = getAddData(options.message);
  return options.account.signTypedData(data);
}
