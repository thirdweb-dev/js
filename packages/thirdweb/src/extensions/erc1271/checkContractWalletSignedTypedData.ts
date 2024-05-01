import { type TypedData, type TypedDataDefinition, hashTypedData } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import { isHex } from "../../utils/encoding/hex.js";
import { isValidSignature } from "./__generated__/isValidSignature/read/isValidSignature.js";

export type CheckContractWalletSignTypedDataOptions<
  typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = {
  contract: ThirdwebContract;
  data: TypedDataDefinition<typedData, primaryType>;
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
 * import { checkContractWalletSignedTypedData } from "thirdweb/extensions/erc1271";
 * const isValid = await checkContractWalletSignedTypedData({
 *  contract: myContract,
 *  data: {
 *   primaryType: "EIP712Domain",
 *   domain: {
 *     name: "Example",
 *     version: "1",
 *     chainId: 1,
 *     verifyingContract: myContract.address,
 *   },
 * });
 * ```
 * @returns A promise that resolves with a boolean indicating if the signature is valid.
 */
export async function checkContractWalletSignedTypedData<
  typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>(options: CheckContractWalletSignTypedDataOptions<typedData, primaryType>) {
  if (!isHex(options.signature)) {
    throw new Error("The signature must be a valid hex string.");
  }
  const result = await isValidSignature({
    contract: options.contract,
    hash: hashTypedData(options.data),
    signature: options.signature,
  });
  return result === MAGIC_VALUE;
}
