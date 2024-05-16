import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x1bc38355" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "address",
    internalType: "address",
  },
] as const;

/**
 * Checks if the `erc1967FactoryAddress` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `erc1967FactoryAddress` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isErc1967FactoryAddressSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isErc1967FactoryAddressSupported(contract);
 * ```
 */
export async function isErc1967FactoryAddressSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the erc1967FactoryAddress function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeErc1967FactoryAddressResult } from "thirdweb/extensions/modular";
 * const result = decodeErc1967FactoryAddressResult("...");
 * ```
 */
export function decodeErc1967FactoryAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "erc1967FactoryAddress" function on the contract.
 * @param options - The options for the erc1967FactoryAddress function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { erc1967FactoryAddress } from "thirdweb/extensions/modular";
 *
 * const result = await erc1967FactoryAddress({
 *  contract,
 * });
 *
 * ```
 */
export async function erc1967FactoryAddress(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
