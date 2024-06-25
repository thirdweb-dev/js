import { recoverAddress } from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { isValidSignature } from "../extensions/erc1271/__generated__/isValidSignature/read/isValidSignature.js";
import { isHex } from "../utils/encoding/hex.js";
import { hashMessage } from "../utils/hashing/hashMessage.js";
import type { Prettify } from "../utils/type-utils.js";

export type VerifyEOASignatureParams = {
  message: string;
  signature: string;
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
 * @auth
 */
export async function verifyEOASignature(options: VerifyEOASignatureParams) {
  const messageHash = hashMessage(options.message);

  if (!isHex(options.signature)) {
    return false;
  }

  const recoveredAddress = await recoverAddress({
    hash: messageHash,
    signature: options.signature,
  });

  if (recoveredAddress.toLowerCase() === options.address.toLowerCase()) {
    return true;
  }
  return false;
}

export type VerifyContractWalletSignatureParams = Prettify<
  VerifyEOASignatureParams & {
    chain: Chain;
    client: ThirdwebClient;
  }
>;

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
 * @auth
 */
export async function verifyContractWalletSignature(
  options: VerifyContractWalletSignatureParams,
) {
  if (!isHex(options.signature)) {
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
    signature: options.signature,
  });

  return result === EIP1271_MAGICVALUE;
}

export type VerifySignatureParams = Prettify<
  VerifyEOASignatureParams & Partial<VerifyContractWalletSignatureParams>
>;

/**
 * Verifies the signature based on the provided options.
 * Handles smart contract wallet signatures and EOA signatures.
 * **IMPORTANT: in order to check smart contract signatures, a chain and client must be provided.**
 * @param options - The options for signature verification.
 * @returns A boolean indicating whether the signature is valid or not.
 * @example
 * ```ts
 * import { verifySignature } from 'thirdweb/auth';
 *
 * const isValid = await verifySignature({
 *  message: 'Your message to sign',
 *  signature: '0x91db0222ec371a8c18d3b187a6d2e77789bffca1b96826ef6b8708e0d4a66c80312fc3ae95b8fbc147265abf539bb6f360152be61a0e1411d7f5771a599e769a1c',
 *  address: '0xda9C7A86AeE76701FC1c23ae548e8E93Ba3e42A5',
 *  client: thirdwebClient,
 *  chain: chain
 * });
 * ```
 * @auth
 */
let warningTriggered = false;
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
  } else if (!warningTriggered) {
    // We only trigger this warning once
    warningTriggered = true;
    console.error(`
      Failed to verify EOA signature and no chain or client provided.

      If you mean to use a smart account, please provide a chain and client.
      For more information on how to setup a smart account with Auth, see https://portal.thirdweb.com/connect/auth
    `);
  }
  // if we reach here, we have no way to verify the signature
  return false;
}

function isVerifyContractWalletSignatureParams(
  options: VerifySignatureParams,
): options is VerifyContractWalletSignatureParams {
  return (
    "chain" in options &&
    options.chain !== undefined &&
    "client" in options &&
    options.client !== undefined
  );
}
