import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getFeeTier" function.
 */
export type GetFeeTierParams = {
  deployer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "deployer";
    type: "address";
  }>;
  proxy: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "proxy";
    type: "address";
  }>;
};

/**
 * Calls the getFeeTier function on the contract.
 * @param options - The options for the getFeeTier function.
 * @returns The parsed result of the function call.
 * @extension IFEETIERPLACEMENTEXTENSION
 * @example
 * ```
 * import { getFeeTier } from "thirdweb/extensions/IFeeTierPlacementExtension";
 *
 * const result = await getFeeTier({
 *  deployer: ...,
 *  proxy: ...,
 * });
 *
 * ```
 */
export async function getFeeTier(
  options: BaseTransactionOptions<GetFeeTierParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x818f8349",
      [
        {
          internalType: "address",
          name: "deployer",
          type: "address",
        },
        {
          internalType: "address",
          name: "proxy",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint128",
          name: "tierId",
          type: "uint128",
        },
        {
          internalType: "uint128",
          name: "validUntilTimestamp",
          type: "uint128",
        },
      ],
    ],
    params: [options.deployer, options.proxy],
  });
}
