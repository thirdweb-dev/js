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
 * Represents the parameters for the "createPack" function.
 */
export type CreatePackParams = WithOverrides<{
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "totalAmount" },
    ];
  }>;
  numOfRewardUnits: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "numOfRewardUnits";
  }>;
  packUri: AbiParameterToPrimitiveType<{ type: "string"; name: "packUri" }>;
  openStartTimestamp: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "openStartTimestamp";
  }>;
  amountDistributedPerOpen: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "amountDistributedPerOpen";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
  }>;
}>;

export const FN_SELECTOR = "0x092e6075" as const;
const FN_INPUTS = [
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
    name: "contents",
    type: "tuple[]",
  },
  {
    name: "numOfRewardUnits",
    type: "uint256[]",
  },
  {
    name: "packUri",
    type: "string",
  },
  {
    name: "openStartTimestamp",
    type: "uint128",
  },
  {
    name: "amountDistributedPerOpen",
    type: "uint128",
  },
  {
    name: "recipient",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "packId",
    type: "uint256",
  },
  {
    name: "packTotalSupply",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `createPack` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createPack` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isCreatePackSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isCreatePackSupported(["0x..."]);
 * ```
 */
export function isCreatePackSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createPack" function.
 * @param options - The options for the createPack function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCreatePackParams } from "thirdweb/extensions/pack";
 * const result = encodeCreatePackParams({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeCreatePackParams(options: CreatePackParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.contents,
    options.numOfRewardUnits,
    options.packUri,
    options.openStartTimestamp,
    options.amountDistributedPerOpen,
    options.recipient,
  ]);
}

/**
 * Encodes the "createPack" function into a Hex string with its parameters.
 * @param options - The options for the createPack function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCreatePack } from "thirdweb/extensions/pack";
 * const result = encodeCreatePack({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeCreatePack(options: CreatePackParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreatePackParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createPack" function on the contract.
 * @param options - The options for the "createPack" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createPack } from "thirdweb/extensions/pack";
 *
 * const transaction = createPack({
 *  contract,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
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
export function createPack(
  options: BaseTransactionOptions<
    | CreatePackParams
    | {
        asyncParams: () => Promise<CreatePackParams>;
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
        resolvedOptions.contents,
        resolvedOptions.numOfRewardUnits,
        resolvedOptions.packUri,
        resolvedOptions.openStartTimestamp,
        resolvedOptions.amountDistributedPerOpen,
        resolvedOptions.recipient,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
