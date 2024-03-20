import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "claim" function.
 */

type ClaimParamsInternal = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "pricePerToken";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "allowlistProof";
    components: [
      { type: "bytes32[]"; name: "proof" },
      { type: "uint256"; name: "maxQuantityInAllowlist" },
    ];
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export type ClaimParams = Prettify<
  | ClaimParamsInternal
  | {
      asyncParams: () => Promise<ClaimParamsInternal>;
    }
>;
const FN_SELECTOR = "0x5ab31c1a" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "receiver",
  },
  {
    type: "uint256",
    name: "quantity",
  },
  {
    type: "address",
    name: "currency",
  },
  {
    type: "uint256",
    name: "pricePerToken",
  },
  {
    type: "tuple",
    name: "allowlistProof",
    components: [
      {
        type: "bytes32[]",
        name: "proof",
      },
      {
        type: "uint256",
        name: "maxQuantityInAllowlist",
      },
    ],
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "claim" function.
 * @param options - The options for the claim function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```
 * import { encodeClaimParams } "thirdweb/extensions/erc20";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.quantity,
    options.currency,
    options.pricePerToken,
    options.allowlistProof,
    options.data,
  ]);
}

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/erc20";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(options: BaseTransactionOptions<ClaimParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.receiver,
              resolvedParams.quantity,
              resolvedParams.currency,
              resolvedParams.pricePerToken,
              resolvedParams.allowlistProof,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.receiver,
            options.quantity,
            options.currency,
            options.pricePerToken,
            options.allowlistProof,
            options.data,
          ],
  });
}
