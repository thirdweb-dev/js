import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "mint" function.
 */

type MintParamsInternal = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

export type MintParams = Prettify<
  | MintParamsInternal
  | {
      asyncParams: () => Promise<MintParamsInternal>;
    }
>;
const FN_SELECTOR = "0x94bf804d" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "receiver",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "mint" function.
 * @param options - The options for the mint function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```
 * import { encodeMintParams } "thirdweb/extensions/erc4626";
 * const result = encodeMintParams({
 *  shares: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMintParams(options: MintParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.shares, options.receiver]);
}

/**
 * Calls the "mint" function on the contract.
 * @param options - The options for the "mint" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```
 * import { mint } from "thirdweb/extensions/erc4626";
 *
 * const transaction = mint({
 *  shares: ...,
 *  receiver: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mint(options: BaseTransactionOptions<MintParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.shares, resolvedParams.receiver] as const;
          }
        : [options.shares, options.receiver],
  });
}
