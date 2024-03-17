/** The following is adapted from the Hubble monorepo */

import type { Address } from "abitype";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import {
  ID_GATEWAY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
} from "./constants.js";
import type { Prettify } from "../../utils/type-utils.js";

///////////////
/** Register */
///////////////

export const ID_GATEWAY_EIP_712_DOMAIN = {
  name: "Farcaster IdGateway",
  version: "1",
  chainId: 10,
  verifyingContract: ID_GATEWAY_ADDRESS,
} as const;

export const ID_GATEWAY_REGISTER_TYPE = [
  { name: "to", type: "address" },
  { name: "recovery", type: "address" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
] as const;

export const ID_GATEWAY_EIP_712_TYPES = {
  domain: ID_GATEWAY_EIP_712_DOMAIN,
  types: { Register: ID_GATEWAY_REGISTER_TYPE },
} as const;

export type RegisterMessage = {
  /** FID custody address */
  to: Address;
  /** FID recovery address */
  recovery: Address;
  /** IdGateway nonce for signer address */
  nonce: bigint;
  /** Unix timestamp when this message expires */
  deadline: bigint;
};

export type SignRegisterOptions = {
  account: Account;
  message: RegisterMessage;
};

/**
 * Constructs the data required for signing a register message in the Farcaster ID Gateway.
 * This includes the EIP-712 domain, types, and the message to be signed.
 * @param message - The register message containing the necessary information for the signature.
 * @returns An object containing the EIP-712 domain, types, and the message, ready to be signed.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getRegisterData } from "thirdweb/extensions/farcaster";
 *
 * const data = getRegisterData(message);
 * ```
 */
export function getRegisterData(message: RegisterMessage) {
  return {
    ...ID_GATEWAY_EIP_712_TYPES,
    primaryType: "Register" as const,
    message,
  };
}

/**
 * Signs the register message for Farcaster ID Gateway.
 * @param options - The signing options.
 * @param options.account - The account to sign the message with.
 * @param options.message - The message to be signed.
 * @returns A promise that resolves to the signature.
 * @extension FARCASTER
 * @example
 * ```ts
 * const signature = await signRegister({ account, message });
 * ```
 */
export async function signRegister({
  account,
  message,
}: SignRegisterOptions): Promise<Hex> {
  const data = getRegisterData(message);
  return account.signTypedData(data);
}

//////////////////
/** Key Request */
//////////////////

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator", // EIP-712 domain data for the SignedKeyRequestValidator.
  version: "1",
  chainId: 10,
  verifyingContract: SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];

export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES = {
  domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
  types: { SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE },
} as const;

export const SIGNED_KEY_REQUEST_METADATA_ABI = [
  {
    components: [
      {
        name: "requestFid",
        type: "uint256",
      },
      {
        name: "requestSigner",
        type: "address",
      },
      {
        name: "signature",
        type: "bytes",
      },
      {
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "SignedKeyRequestMetadata",
    type: "tuple",
  },
] as const;

export type SignedKeyRequestMessage = {
  /** FID of user or app requesting key */
  requestFid: bigint;
  /** Signer public key */
  key: Hex;
  /** Unix timestamp when this message expires */
  deadline: bigint;
};

export type SignKeyRequestOptions = {
  account: Account;
  message: SignedKeyRequestMessage;
};

/**
 * Prepares the data required for signing a key request using EIP-712 typed data signing.
 * This includes the domain, types, primary type, and the message to be signed.
 * @param message - The message to be signed, containing the request FID, key, and deadline.
 * @returns An object containing the domain, types, primary type, and the message for EIP-712 signing.
 * @extension FARCASTER
 * @example
 * ```
 * const message = {
 *   requestFid: 123456789n,
 *   key: "0x04bfc...",
 *   deadline: 1657758061n,
 * };
 * const eip712Data = getKeyRequestData(message);
 * ```
 */
export function getKeyRequestData(message: SignedKeyRequestMessage) {
  return {
    ...SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES,
    primaryType: "SignedKeyRequest" as const,
    message,
  };
}

/**
 * Signs a key request message using EIP-712 typed data signing.
 * This function prepares the data for signing, signs it with the provided account, and returns the signature.
 * @param options - The options for signing the key request, including the account and the message.
 * @returns A promise that resolves to the signature of the key request.
 * @extension FARCASTER
 * @example
 * ```
 * const message = {
 *   requestFid: 123456789n,
 *   key: "0x04bfc...",
 *   deadline: 1657758061n,
 * };
 *
 * const signature = signKeyRequest({ account: signerAccount, message });
 * ```
 */
export async function signKeyRequest(
  options: SignKeyRequestOptions,
): Promise<Hex> {
  const data = getKeyRequestData(options.message);
  return options.account.signTypedData(data);
}

export type SignedKeyRequestMetadataOptions = Prettify<
  {
    message: SignedKeyRequestMessage;
  } & (
    | {
        account: Account;
      }
    | { keyRequestSignature: Hex; accountAddress: Address }
  )
>;

/**
 * Encodes the signed key request metadata into a hexadecimal string.
 * This function takes in the request signer's address, the key request signature, the request Fid, and the deadline,
 * and returns the encoded ABI parameters as a hexadecimal string. It's used to prepare the metadata for transactions
 * involving signed key requests.
 * @param options - The options for encoding the signed key request metadata.
 * @param options.requestSigner - The address of the new signer.
 * @param options.keyRequestSignature - The hexadecimal string of the key request signature.
 * @param options.requestFid - The Fid of the app account.
 * @param options.deadline - The deadline of the request.
 * @returns The encoded ABI parameters as a hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```
 * const encodedMetadata = encodeSignedKeyRequestMetadata({
 *   requestSigner: "0x123...",
 *   keyRequestSignature: "0xabcd...",
 *   requestFid: 123456789n,
 *   deadline: 1657758061n,
 * });
 * ```
 */
export function encodeSignedKeyRequestMetadata(options: {
  requestSigner: Address;
  keyRequestSignature: Hex;
  requestFid: bigint;
  deadline: bigint;
}): Hex {
  return encodeAbiParameters(SIGNED_KEY_REQUEST_METADATA_ABI, [
    {
      requestFid: options.requestFid,
      requestSigner: options.requestSigner,
      signature: options.keyRequestSignature,
      deadline: options.deadline,
    },
  ]);
}

/**
 * Generates the signed key request metadata to add a signer to an account.
 * This function can either sign a new key request using an account object or use an existing key request signature.
 * It prepares the metadata necessary for transactions involving signed key requests.
 * @param options - The options for signing the key request or using an existing signature.
 * @returns A promise that resolves to the hexadecimal string of the encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```
 * import { getSignedKeyRequestMetadata } from "thirdweb/extensions/farcaster";
 *
 * // Using an existing signature
 * const signedMetadata = await getSignedKeyRequestMetadata({
 *   keyRequestSignature: "0xabcd...",
 *   accountAddress: "0x123...",
 *   message: {
 *     requestFid: 123456789n,
 *     deadline: 1657758061n,
 *   },
 * });
 *
 * // Signing a new key request
 * const signedMetadata = await getSignedKeyRequestMetadata({
 *   account,
 *   message: {
 *     requestFid: 123456789n,
 *     deadline: 1657758061n,
 *   },
 * });
 * ```
 */
export async function getSignedKeyRequestMetadata(
  options: SignedKeyRequestMetadataOptions,
): Promise<Hex> {
  let signature;
  if ("account" in options) {
    signature = await signKeyRequest({
      account: options.account,
      message: options.message,
    });
  } else {
    signature = options.keyRequestSignature;
  }

  return encodeAbiParameters(SIGNED_KEY_REQUEST_METADATA_ABI, [
    {
      requestFid: options.message.requestFid,
      requestSigner:
        "account" in options ? options.account.address : options.accountAddress,
      signature,
      deadline: options.message.deadline,
    },
  ]);
}

//////////
/** Add */
//////////

export const KEY_GATEWAY_EIP_712_DOMAIN = {
  name: "Farcaster KeyGateway",
  version: "1",
  chainId: 10,
  verifyingContract: KEY_GATEWAY_ADDRESS,
} as const;

export const KEY_GATEWAY_ADD_TYPE = [
  { name: "owner", type: "address" },
  { name: "keyType", type: "uint32" },
  { name: "key", type: "bytes" },
  { name: "metadataType", type: "uint8" },
  { name: "metadata", type: "bytes" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
] as const;

export const KEY_GATEWAY_EIP_712_TYPES = {
  domain: KEY_GATEWAY_EIP_712_DOMAIN,
  types: { Add: KEY_GATEWAY_ADD_TYPE },
} as const;

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
    primaryType: "Add" as const,
    message,
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
