import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "maxMint" function.
 */
export type MaxMintParams = {
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

/**
 * Calls the "maxMint" function on the contract.
 * @param options - The options for the maxMint function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { maxMint } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxMint({
 *  receiver: ...,
 * });
 *
 * ```
 */
export async function maxMint(options: BaseTransactionOptions<MaxMintParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc63d75b6",
      [
        {
          name: "receiver",
          type: "address",
          internalType: "address",
        },
      ],
      [
        {
          name: "maxShares",
          type: "uint256",
          internalType: "uint256",
        },
      ],
    ],
    params: [options.receiver],
  });
}
