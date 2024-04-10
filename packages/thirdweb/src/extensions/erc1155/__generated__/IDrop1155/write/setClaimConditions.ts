import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  phases: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "phases";
    components: [
      { type: "uint256"; name: "startTimestamp" },
      { type: "uint256"; name: "maxClaimableSupply" },
      { type: "uint256"; name: "supplyClaimed" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "bytes32"; name: "merkleRoot" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "string"; name: "metadata" },
    ];
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "resetClaimEligibility";
  }>;
}>;

export const FN_SELECTOR = "0x183718d1" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "tuple[]",
    name: "phases",
    components: [
      {
        type: "uint256",
        name: "startTimestamp",
      },
      {
        type: "uint256",
        name: "maxClaimableSupply",
      },
      {
        type: "uint256",
        name: "supplyClaimed",
      },
      {
        type: "uint256",
        name: "quantityLimitPerWallet",
      },
      {
        type: "bytes32",
        name: "merkleRoot",
      },
      {
        type: "uint256",
        name: "pricePerToken",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "string",
        name: "metadata",
      },
    ],
  },
  {
    type: "bool",
    name: "resetClaimEligibility",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setClaimConditions" function.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetClaimConditionsParams } "thirdweb/extensions/erc1155";
 * const result = encodeSetClaimConditionsParams({
 *  tokenId: ...,
 *  phases: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionsParams(
  options: SetClaimConditionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenId,
    options.phases,
    options.resetClaimEligibility,
  ]);
}

/**
 * Calls the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/erc1155";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  tokenId: ...,
 *  phases: ...,
 *  resetClaimEligibility: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimConditions(
  options: BaseTransactionOptions<
    | SetClaimConditionsParams
    | {
        asyncParams: () => Promise<SetClaimConditionsParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.tokenId,
        resolvedOptions.phases,
        resolvedOptions.resetClaimEligibility,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
