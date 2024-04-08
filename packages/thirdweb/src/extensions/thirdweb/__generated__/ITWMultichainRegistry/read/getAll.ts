import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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
