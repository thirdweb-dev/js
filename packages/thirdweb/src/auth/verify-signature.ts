import * as ox__Bytes from "ox/Bytes";
import * as ox__Secp256k1 from "ox/Secp256k1";
import * as ox__Signature from "ox/Signature";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { type Hex, isHex } from "../utils/encoding/hex.js";
import { hashMessage } from "../utils/hashing/hashMessage.js";
import type { Prettify } from "../utils/type-utils.js";
import { verifyHash } from "./verify-hash.js";

type Message = Prettify<
  | string
  | {
      raw: Hex | Uint8Array;
    }
>;

/**
 * @auth
 */
export type VerifyEOASignatureParams = {
  message: string | Message;
  signature: string | Uint8Array;
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

  const recoveredAddress = ox__Secp256k1.recoverAddress({
    payload: messageHash,
    signature: ox__Signature.fromHex(options.signature),
  });

  if (recoveredAddress.toLowerCase() === options.address.toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * @auth
 */
export type VerifyContractWalletSignatureParams = Prettify<
  VerifyEOASignatureParams & {
    chain: Chain;
    client: ThirdwebClient;
    accountFactory?: {
      address: string;
      verificationCalldata: Hex;
    };
  }
>;

/**
 * Verifies a contract wallet signature using [ERC-6942](https://eips.ethereum.org/EIPS/eip-6942) Signature Validation for Predeploy Contracts.
 * This function will validate signatures for both deployed and undeployed smart accounts of all signature types.
 *
 * @param {@link VerifyContractWalletSignatureParams} options - The parameters for verifying the signature.
 * @param {string} options.address The address of the contract wallet to verify the signature for. This can be an undeployed coutnerfactual address.
 * @param {string} options.message The message that was signed
 * @param {string} options.signature The signature to verify.
 * @param {Chain} options.chain The chain to verify the signature on. Make sure this was the chain your signature was generated for, even if your smart account exists on multiple chains.
 * @param {ThirdwebClient} options.client The Thirdweb client to use for necessary RPC requests.
 * @param {Object} [options.accountFactory] A custom account factory to use for signature verification. This is only necessary if the account is not yet deployed AND the signature was not pre-wrapped for ERC-6492 validation. Most wallets that do not automatically deploy smart accounts prior to signatures will wrap the signature for you.
 * @param {string} [options.accountFactory.address] The account factory address from which the smart account was or will be deployed.
 * @param {Hex} [options.accountFactory.verificationCalldata] The account factory verification calldata for predeploy verification. See [EIP-6942](https://eips.ethereum.org/EIPS/eip-6942) for more information.
 *
 * @returns A boolean indicating whether the signature is valid.
 *
 * @example
 * ```ts
 * import { verifyContractWalletSignature } from 'thirdweb/auth';
 *
 * const isValid = await verifyContractWalletSignature({
 *  message: '0x..',
 *  signature: '0x..',
 *  address: '0x...',
 *  chain: ...,
 *  client: ...,
 * });
 * ```
 * @auth
 */
export async function verifyContractWalletSignature({
  signature,
  message,
  address,
  chain,
  client,
  accountFactory,
}: VerifyContractWalletSignatureParams) {
  const messageHash = hashMessage(message);

  const parsedSignature = (() => {
    if (ox__Bytes.validate(signature)) {
      return ox__Bytes.toHex(signature);
    }
    return signature;
  })();

  return verifyHash({
    accountFactory,
    address,
    chain,
    client,
    hash: messageHash,
    signature: parsedSignature,
  });
}

export type VerifySignatureParams = Prettify<
  VerifyEOASignatureParams & Partial<VerifyContractWalletSignatureParams>
>;

let warningTriggered = false;

/**
 * Verifies the signature based on the provided options.
 * Handles smart contract wallet signatures and EOA signatures.
 * **IMPORTANT: in order to check smart contract signatures, a chain and client must be provided. Or, you can use the `verifyContractWalletSignature` function directly if all signatures will be from smart accounts.**
 * @see verifyContractWalletSignature
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
    } catch (err) {
      console.error("Error verifying smart contract wallet signature", err);
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
