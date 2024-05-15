import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getAll" function.
 */
export type GetAllParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
};

export const FN_SELECTOR = "0xeb077342" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_deployer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "allDeployments",
    components: [
      {
        type: "address",
        name: "deploymentAddress",
      },
      {
        type: "uint256",
        name: "chainId",
      },
      {
        type: "string",
        name: "metadataURI",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAll` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAll` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetAllSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = await isGetAllSupported(contract);
 * ```
 */
export async function isGetAllSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAll" function.
 * @param options - The options for the getAll function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetAllParams } "thirdweb/extensions/thirdweb";
 * const result = encodeGetAllParams({
 *  deployer: ...,
 * });
 * ```
 */
export function encodeGetAllParams(options: GetAllParams) {
  return encodeAbiParameters(FN_INPUTS, [options.deployer]);
}

/**
 * Encodes the "getAll" function into a Hex string with its parameters.
 * @param options - The options for the getAll function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetAll } "thirdweb/extensions/thirdweb";
 * const result = encodeGetAll({
 *  deployer: ...,
 * });
 * ```
 */
export function encodeGetAll(options: GetAllParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAll function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetAllResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetAllResult("...");
 * ```
 */
export function decodeGetAllResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAll" function on the contract.
 * @param options - The options for the getAll function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getAll } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAll({
 *  contract,
 *  deployer: ...,
 * });
 *
 * ```
 */
export async function getAll(options: BaseTransactionOptions<GetAllParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.deployer],
  });
}
