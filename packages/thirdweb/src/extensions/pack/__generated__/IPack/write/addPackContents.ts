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
 * Represents the parameters for the "addPackContents" function.
 */
export type AddPackContentsParams = WithOverrides<{
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_packId" }>;
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "_contents";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "totalAmount" },
    ];
  }>;
  numOfRewardUnits: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "_numOfRewardUnits";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_recipient";
  }>;
}>;

export const FN_SELECTOR = "0xa96b1438" as const;
const FN_INPUTS = [
  {
    name: "_packId",
    type: "uint256",
  },
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "_contents",
    type: "tuple[]",
  },
  {
    name: "_numOfRewardUnits",
    type: "uint256[]",
  },
  {
    name: "_recipient",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "packTotalSupply",
    type: "uint256",
  },
  {
    name: "newSupplyAdded",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `addPackContents` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addPackContents` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isAddPackContentsSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isAddPackContentsSupported(["0x..."]);
 * ```
 */
export function isAddPackContentsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addPackContents" function.
 * @param options - The options for the addPackContents function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeAddPackContentsParams } from "thirdweb/extensions/pack";
 * const result = encodeAddPackContentsParams({
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeAddPackContentsParams(options: AddPackContentsParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.packId,
    options.contents,
    options.numOfRewardUnits,
    options.recipient,
  ]);
}

/**
 * Encodes the "addPackContents" function into a Hex string with its parameters.
 * @param options - The options for the addPackContents function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeAddPackContents } from "thirdweb/extensions/pack";
 * const result = encodeAddPackContents({
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeAddPackContents(options: AddPackContentsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddPackContentsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addPackContents" function on the contract.
 * @param options - The options for the "addPackContents" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addPackContents } from "thirdweb/extensions/pack";
 *
 * const transaction = addPackContents({
 *  contract,
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  recipient: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addPackContents(
  options: BaseTransactionOptions<
    | AddPackContentsParams
    | {
        asyncParams: () => Promise<AddPackContentsParams>;
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
      return [
        resolvedOptions.packId,
        resolvedOptions.contents,
        resolvedOptions.numOfRewardUnits,
        resolvedOptions.recipient,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
