import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAddress" function.
 */
export type GetAddressParams = {
  adminSigner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "adminSigner";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

const METHOD = [
  "0x8878ed33",
  [
    {
      type: "address",
      name: "adminSigner",
    },
    {
      type: "bytes",
      name: "data",
    },
  ],
  [
    {
      type: "address",
    },
  ],
] as const;

/**
 * Calls the "getAddress" function on the contract.
 * @param options - The options for the getAddress function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getAddress } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAddress({
 *  adminSigner: ...,
 *  data: ...,
 * });
 *
 * ```
 */
export async function getAddress(
  options: BaseTransactionOptions<GetAddressParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.adminSigner, options.data],
  });
}
