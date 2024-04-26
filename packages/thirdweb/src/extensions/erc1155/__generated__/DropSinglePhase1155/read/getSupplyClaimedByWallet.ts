import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getSupplyClaimedByWallet" function.
 */
export type GetSupplyClaimedByWalletParams = {
  tokenId: AbiParameterToPrimitiveType<{
    name: "_tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
  claimer: AbiParameterToPrimitiveType<{
    name: "_claimer";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xad1eefc5" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_claimer",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `getSupplyClaimedByWallet` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getSupplyClaimedByWallet` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetSupplyClaimedByWalletSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isGetSupplyClaimedByWalletSupported(contract);
 * ```
 */
export async function isGetSupplyClaimedByWalletSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getSupplyClaimedByWallet" function.
 * @param options - The options for the getSupplyClaimedByWallet function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetSupplyClaimedByWalletParams } "thirdweb/extensions/erc1155";
 * const result = encodeGetSupplyClaimedByWalletParams({
 *  tokenId: ...,
 *  claimer: ...,
 * });
 * ```
 */
export function encodeGetSupplyClaimedByWalletParams(
  options: GetSupplyClaimedByWalletParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.claimer]);
}

/**
 * Encodes the "getSupplyClaimedByWallet" function into a Hex string with its parameters.
 * @param options - The options for the getSupplyClaimedByWallet function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetSupplyClaimedByWallet } "thirdweb/extensions/erc1155";
 * const result = encodeGetSupplyClaimedByWallet({
 *  tokenId: ...,
 *  claimer: ...,
 * });
 * ```
 */
export function encodeGetSupplyClaimedByWallet(
  options: GetSupplyClaimedByWalletParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetSupplyClaimedByWalletParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getSupplyClaimedByWallet function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeGetSupplyClaimedByWalletResult } from "thirdweb/extensions/erc1155";
 * const result = decodeGetSupplyClaimedByWalletResult("...");
 * ```
 */
export function decodeGetSupplyClaimedByWalletResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSupplyClaimedByWallet" function on the contract.
 * @param options - The options for the getSupplyClaimedByWallet function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getSupplyClaimedByWallet } from "thirdweb/extensions/erc1155";
 *
 * const result = await getSupplyClaimedByWallet({
 *  tokenId: ...,
 *  claimer: ...,
 * });
 *
 * ```
 */
export async function getSupplyClaimedByWallet(
  options: BaseTransactionOptions<GetSupplyClaimedByWalletParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId, options.claimer],
  });
}
