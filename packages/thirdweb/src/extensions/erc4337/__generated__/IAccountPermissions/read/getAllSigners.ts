import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xd42f2f35" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "signers",
    components: [
      {
        type: "address",
        name: "signer",
      },
      {
        type: "address[]",
        name: "approvedTargets",
      },
      {
        type: "uint256",
        name: "nativeTokenLimitPerTransaction",
      },
      {
        type: "uint128",
        name: "startTimestamp",
      },
      {
        type: "uint128",
        name: "endTimestamp",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllSigners` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllSigners` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetAllSignersSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetAllSignersSupported(contract);
 * ```
 */
export async function isGetAllSignersSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllSigners function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetAllSignersResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetAllSignersResult("...");
 * ```
 */
export function decodeGetAllSignersResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllSigners" function on the contract.
 * @param options - The options for the getAllSigners function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getAllSigners } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAllSigners({
 *  contract,
 * });
 *
 * ```
 */
export async function getAllSigners(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
