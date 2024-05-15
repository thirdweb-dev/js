import { type SignableMessage, hashMessage } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import { isHex } from "../../utils/encoding/hex.js";
import { isValidSignature } from "./__generated__/isValidSignature/read/isValidSignature.js";

export type CheckContractWalletSignatureOptions = {
  contract: ThirdwebContract;
  message: SignableMessage;
  signature: string;
};
const MAGIC_VALUE = "0x1626ba7e";

/**
 * Checks if a contract wallet signature is valid.
 * @param options - The options for the checkContractWalletSignature function.
 * @param options.contract - The contract to check the signature against.
 * @param options.message - The message to check the signature against.
 * @param options.signature - The signature to check.
 * @extension ERC1271
 * @example
 * ```ts
 * import { checkContractWalletSignature } from "thirdweb/extensions/erc1271";
 * const isValid = await checkContractWalletSignature({
 *  contract: myContract,
 *  message: "hello world",
 *  signature: "0x...",
 * });
 * ```
 * @returns A promise that resolves with a boolean indicating if the signature is valid.
 */
export async function checkContractWalletSignature(
  options: CheckContractWalletSignatureOptions,
) {
  if (!isHex(options.signature)) {
    throw new Error("The signature must be a valid hex string.");
  }
  const result = await isValidSignature({
    contract: options.contract,
    hash: hashMessage(options.message),
    signature: options.signature,
  });
  return result === MAGIC_VALUE;
}
