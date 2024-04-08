import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "delegateBySig" function.
 */

export type DelegateBySigParams = {
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
  nonce: AbiParameterToPrimitiveType<{ type: "uint256"; name: "nonce" }>;
  expiry: AbiParameterToPrimitiveType<{ type: "uint256"; name: "expiry" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
};

export const FN_SELECTOR = "0xc3cda520" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "delegatee",
  },
  {
    type: "uint256",
    name: "nonce",
  },
  {
    type: "uint256",
    name: "expiry",
  },
  {
    type: "uint8",
    name: "v",
  },
  {
    type: "bytes32",
    name: "r",
  },
  {
    type: "bytes32",
    name: "s",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "delegateBySig" function.
 * @param options - The options for the delegateBySig function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegateBySigParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegateBySigParams({
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodeDelegateBySigParams(options: DelegateBySigParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.delegatee,
    options.nonce,
    options.expiry,
    options.v,
    options.r,
    options.s,
  ]);
}

/**
 * Calls the "delegateBySig" function on the contract.
 * @param options - The options for the "delegateBySig" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { delegateBySig } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegateBySig({
 *  contract,
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function delegateBySig(
  options: BaseTransactionOptions<
    | DelegateBySigParams
    | {
        asyncParams: () => Promise<DelegateBySigParams>;
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
            return [
              resolvedParams.delegatee,
              resolvedParams.nonce,
              resolvedParams.expiry,
              resolvedParams.v,
              resolvedParams.r,
              resolvedParams.s,
            ] as const;
          }
        : [
            options.delegatee,
            options.nonce,
            options.expiry,
            options.v,
            options.r,
            options.s,
          ],
  });
}
