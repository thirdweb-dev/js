import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "uninstallHook" function.
 */

export type UninstallHookParams = {
  hooksToUninstall: AbiParameterToPrimitiveType<{
    name: "_hooksToUninstall";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x2382b7e6" as const;
const FN_INPUTS = [
  {
    name: "_hooksToUninstall",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "uninstallHook" function.
 * @param options - The options for the uninstallHook function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeUninstallHookParams } "thirdweb/extensions/erc721";
 * const result = encodeUninstallHookParams({
 *  hooksToUninstall: ...,
 * });
 * ```
 */
export function encodeUninstallHookParams(options: UninstallHookParams) {
  return encodeAbiParameters(FN_INPUTS, [options.hooksToUninstall]);
}

/**
 * Calls the "uninstallHook" function on the contract.
 * @param options - The options for the "uninstallHook" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { uninstallHook } from "thirdweb/extensions/erc721";
 *
 * const transaction = uninstallHook({
 *  contract,
 *  hooksToUninstall: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function uninstallHook(
  options: BaseTransactionOptions<
    | UninstallHookParams
    | {
        asyncParams: () => Promise<UninstallHookParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.hooksToUninstall] as const;
          }
        : [options.hooksToUninstall],
  });
}
