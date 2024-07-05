import { equalBytes } from "@noble/curves/abstract/utils";
import {
  type Signature,
  encodeDeployData,
  recoverAddress,
  serializeSignature,
} from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { eth_call } from "../rpc/actions/eth_call.js";
import { getRpcClient } from "../rpc/rpc.js";
import { fromBytes } from "../utils/encoding/from-bytes.js";
import { type Hex, isHex } from "../utils/encoding/hex.js";
import { toBytes } from "../utils/encoding/to-bytes.js";
import { hashMessage } from "../utils/hashing/hashMessage.js";
import type { Prettify } from "../utils/type-utils.js";
import { DEFAULT_ACCOUNT_FACTORY } from "../wallets/smart/lib/constants.js";
import {
  universalSignatureValidatorAbi,
  universalSignatureValidatorByteCode,
} from "./constants.js";
import { isErc6492Signature } from "./is-erc6492-signature.js";
import { serializeErc6492Signature } from "./serialize-erc6492-signature.js";

export type VerifyEOASignatureParams = {
  message: string;
  signature: string | Uint8Array | Signature;
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
    accountFactory?: {
      address: string;
      verificationCalldata: Hex;
    };
  }
>;

/**
 * @description Verifies a contract wallet signature using [ERC-6942](https://eips.ethereum.org/EIPS/eip-6942) Signature Validation for Predeploy Contracts.
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
  console.log("verifyContractWalletSignature");
  const messageHash = hashMessage(message);

  const signatureHex = (() => {
    if (isHex(signature)) return signature;
    if (typeof signature === "object" && "r" in signature && "s" in signature)
      return serializeSignature(signature);
    if (signature instanceof Uint8Array) return fromBytes(signature, "hex");
    // We should never hit this but TS doesn't know that
    throw new Error(
      `Invalid signature type for signature ${signature}: ${typeof signature}`,
    );
  })();

  const accountContract = getContract({
    address,
    chain,
    client,
  });

  const wrappedSignature = await (async () => {
    // If this sigature was already wrapped for ERC-6492, carry on
    if (isErc6492Signature(signatureHex)) return signatureHex;

    // If the contract is already deployed, return the original signature
    const { isContractDeployed } = await import(
      "../utils/bytecode/is-contract-deployed.js"
    );
    const isDeployed = await isContractDeployed(accountContract);
    if (!isDeployed) return signatureHex;

    // Otherwise, serialize the signature for ERC-6492 validation
    return serializeErc6492Signature({
      address: accountFactory?.address ?? DEFAULT_ACCOUNT_FACTORY,
      data: accountFactory?.verificationCalldata ?? "0x",
      signature: signatureHex,
    });
  })();

  const verificationData = encodeDeployData({
    abi: universalSignatureValidatorAbi,
    args: [address, messageHash, wrappedSignature],
    bytecode: universalSignatureValidatorByteCode,
  });

  const rpcRequest = getRpcClient({
    chain,
    client,
  });

  try {
    const result = await eth_call(rpcRequest, {
      data: verificationData,
    });

    const hexResult = isHex(result) ? toBytes(result) : result;
    return equalBytes(hexResult, toBytes("0x1"));
  } catch (error) {
    console.log("error", error);
    // TODO: Improve overall RPC error handling so we can tell if this was an actual verification failure or some other error
    // Verification failed somehow
    return false;
  }
}

export type VerifySignatureParams = Prettify<
  VerifyEOASignatureParams & Partial<VerifyContractWalletSignatureParams>
>;

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
