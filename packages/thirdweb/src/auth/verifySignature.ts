import { recoverAddress } from "viem";
import { hashMessage } from "../utils/hashing/hashMessage.js";
import { isHex } from "../utils/encoding/hex.js";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { isValidSignature } from "../extensions/erc1271/__generated__/isValidSignature/read/isValidSignature.js";

export type VerifyEOASignatureParams = {
  message: string;
  singature: string;
  address: string;
};

/**
 * Verifies the signature of a message using an Ethereum account's EOA (Externally Owned Account).
 * @param options - The options for verifying the signature.
 * @returns A boolean indicating whether the signature is valid.
 * @throws An error if the signature is invalid.
 * @example
 * ```ts
 * import { verifyEOASignature } from 'thirdweb/auth';
 *
 * const isValid = await verifyEOASignature({
 *  message: '0x1234567890123456789012345678901234567890',
 *  signature: '0x1234567890123456789012345678901234567890',
 *  address: '0x1234567890123456789012345678901234567890',
 * });
 * ```
 */
export async function verifyEOASignature(options: VerifyEOASignatureParams) {
  const messageHash = hashMessage(options.message);

  if (!isHex(options.singature)) {
    throw new Error("Invalid signature");
  }

  const recoveredAddress = await recoverAddress({
    hash: messageHash,
    signature: options.singature,
  });

  if (recoveredAddress.toLowerCase() === options.address.toLowerCase()) {
    return true;
  }
  return false;
}

export type VerifyContractWalletSignatureParams = VerifyEOASignatureParams & {
  chain: Chain;
  client: ThirdwebClient;
};

const EIP1271_MAGICVALUE = "0x1626ba7e";

/**
 * Verifies the signature of a contract wallet.
 * @param options - The parameters for verifying the signature.
 * @returns A boolean indicating whether the signature is valid.
 * @throws An error if the signature is invalid.
 * @example
 * ```ts
 * import { verifyContractWalletSignature } from 'thirdweb/auth';
 *
 * const isValid = await verifyContractWalletSignature({
 *  message: '0x1234567890123456789012345678901234567890',
 *  signature: '0x1234567890123456789012345678901234567890',
 *  address: '0x1234567890123456789012345678901234567890',
 *  chain: ...,
 *  client: ...,
 * });
 * ```
 */
export async function verifyContractWalletSignature(
  options: VerifyContractWalletSignatureParams,
) {
  if (!isHex(options.singature)) {
    throw new Error("Invalid signature");
  }

  const contract = getContract({
    address: options.address,
    chain: options.chain,
    client: options.client,
  });

  const messageHash = hashMessage(options.message);

  const result = await isValidSignature({
    contract,
    hash: messageHash,
    signature: options.singature,
  });

  return result === EIP1271_MAGICVALUE;
}

export type VerifySignatureParams = VerifyEOASignatureParams &
  Partial<VerifyContractWalletSignatureParams>;

/**
 * Verifies the signature based on the provided options.
 * @param options - The options for signature verification.
 * @returns A boolean indicating whether the signature is valid or not.
 * @example
 * ```ts
 * import { verifySignature } from 'thirdweb/auth';
 *
 * const isValid = await verifySignature({
 *  message: '0x1234567890123456789012345678901234567890',
 *  signature: '0x1234567890123456789012345678901234567890',
 *  address: '0x1234567890123456789012345678901234567890'
 * });
 * ```
 */
export async function verifySignature(options: VerifySignatureParams) {
  try {
    const isValidEOASig = await verifyEOASignature(options);
    if (isValidEOASig) {
      return true;
    }
  } catch {
    // no-op, we skip to contract signature check
  }
  if (isVerifyContractWalletSignatureParams(options)) {
    try {
      return await verifyContractWalletSignature(options);
    } catch {
      // no-op we skip to return false
    }
  }
  // if we reach here, we have no way to verify the signature
  return false;
}

function isVerifyContractWalletSignatureParams(
  options: VerifySignatureParams,
): options is VerifyContractWalletSignatureParams {
  return "chain" in options && "client" in options;
}
