import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setClaimConditionByTokenId" function.
 */
export type SetClaimConditionByTokenIdParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  claimCondition: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_claimCondition";
    components: [
      { type: "uint256"; name: "availableSupply" },
      { type: "bytes32"; name: "allowlistMerkleRoot" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "maxMintPerWallet" },
      { type: "uint48"; name: "startTimestamp" },
      { type: "uint48"; name: "endTimestamp" },
      { type: "string"; name: "auxData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x3bcec708" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
  {
    components: [
      {
        name: "availableSupply",
        type: "uint256",
      },
      {
        name: "allowlistMerkleRoot",
        type: "bytes32",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "maxMintPerWallet",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
      },
      {
        name: "auxData",
        type: "string",
      },
    ],
    name: "_claimCondition",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setClaimConditionByTokenId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setClaimConditionByTokenId` method is supported.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const supported = ClaimableERC1155.isSetClaimConditionByTokenIdSupported(["0x..."]);
 * ```
 */
export function isSetClaimConditionByTokenIdSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setClaimConditionByTokenId" function.
 * @param options - The options for the setClaimConditionByTokenId function.
 * @returns The encoded ABI parameters.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeSetClaimConditionByTokenIdParams({
 *  tokenId: ...,
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionByTokenIdParams(
  options: SetClaimConditionByTokenIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenId,
    options.claimCondition,
  ]);
}

/**
 * Encodes the "setClaimConditionByTokenId" function into a Hex string with its parameters.
 * @param options - The options for the setClaimConditionByTokenId function.
 * @returns The encoded hexadecimal string.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeSetClaimConditionByTokenId({
 *  tokenId: ...,
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionByTokenId(
  options: SetClaimConditionByTokenIdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetClaimConditionByTokenIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setClaimConditionByTokenId" function on the contract.
 * @param options - The options for the "setClaimConditionByTokenId" function.
 * @returns A prepared transaction object.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC1155.setClaimConditionByTokenId({
 *  contract,
 *  tokenId: ...,
 *  claimCondition: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setClaimConditionByTokenId(
  options: BaseTransactionOptions<
    | SetClaimConditionByTokenIdParams
    | {
        asyncParams: () => Promise<SetClaimConditionByTokenIdParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.tokenId, resolvedOptions.claimCondition] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
