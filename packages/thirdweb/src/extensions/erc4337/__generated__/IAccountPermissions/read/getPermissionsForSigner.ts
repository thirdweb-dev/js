import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPermissionsForSigner" function.
 */
export type GetPermissionsForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0xf15d424e" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "signer",
        type: "address",
      },
      {
        name: "approvedTargets",
        type: "address[]",
      },
      {
        name: "nativeTokenLimitPerTransaction",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint128",
      },
      {
        name: "endTimestamp",
        type: "uint128",
      },
    ],
    name: "permissions",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getPermissionsForSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPermissionsForSigner` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetPermissionsForSignerSupported } from "thirdweb/extensions/erc4337";
 * const supported = isGetPermissionsForSignerSupported(["0x..."]);
 * ```
 */
export function isGetPermissionsForSignerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPermissionsForSigner" function.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetPermissionsForSignerParams } from "thirdweb/extensions/erc4337";
 * const result = encodeGetPermissionsForSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetPermissionsForSignerParams(
  options: GetPermissionsForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "getPermissionsForSigner" function into a Hex string with its parameters.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetPermissionsForSigner } from "thirdweb/extensions/erc4337";
 * const result = encodeGetPermissionsForSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetPermissionsForSigner(
  options: GetPermissionsForSignerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPermissionsForSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPermissionsForSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetPermissionsForSignerResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetPermissionsForSignerResultResult("...");
 * ```
 */
export function decodeGetPermissionsForSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPermissionsForSigner" function on the contract.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getPermissionsForSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await getPermissionsForSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getPermissionsForSigner(
  options: BaseTransactionOptions<GetPermissionsForSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
