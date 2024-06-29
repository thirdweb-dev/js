import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "installHook" function.
 */

export type InstallHookParams = {
  params: AbiParameterToPrimitiveType<{
    name: "_params";
    type: "tuple";
    internalType: "struct IHookInstaller.InstallHookParams";
    components: [
      { name: "hook"; type: "address"; internalType: "contract IHook" },
      { name: "initCallValue"; type: "uint256"; internalType: "uint256" },
      { name: "initCalldata"; type: "bytes"; internalType: "bytes" },
    ];
  }>;
};

const FN_SELECTOR = "0xc1b419a5" as const;
const FN_INPUTS = [
  {
    name: "_params",
    type: "tuple",
    internalType: "struct IHookInstaller.InstallHookParams",
    components: [
      {
        name: "hook",
        type: "address",
        internalType: "contract IHook",
      },
      {
        name: "initCallValue",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "initCalldata",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "installHook" function.
 * @param options - The options for the installHook function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeInstallHookParams } "thirdweb/extensions/erc721";
 * const result = encodeInstallHookParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeInstallHookParams(options: InstallHookParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "installHook" function on the contract.
 * @param options - The options for the "installHook" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { installHook } from "thirdweb/extensions/erc721";
 *
 * const transaction = installHook({
 *  contract,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function installHook(
  options: BaseTransactionOptions<
    | InstallHookParams
    | {
        asyncParams: () => Promise<InstallHookParams>;
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
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
