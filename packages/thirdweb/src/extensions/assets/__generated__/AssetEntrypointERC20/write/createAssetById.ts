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
 * Represents the parameters for the "createAssetById" function.
 */
export type CreateAssetByIdParams = WithOverrides<{
  contractId: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "contractId";
  }>;
  creator: AbiParameterToPrimitiveType<{ type: "address"; name: "creator" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint256"; name: "amount" },
      { type: "address"; name: "referrer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1c8dd10a" as const;
const FN_INPUTS = [
  {
    name: "contractId",
    type: "bytes32",
  },
  {
    name: "creator",
    type: "address",
  },
  {
    components: [
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "referrer",
        type: "address",
      },
      {
        name: "salt",
        type: "bytes32",
      },
      {
        name: "data",
        type: "bytes",
      },
      {
        name: "hookData",
        type: "bytes",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "asset",
    type: "address",
  },
] as const;

/**
 * Checks if the `createAssetById` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAssetById` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isCreateAssetByIdSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isCreateAssetByIdSupported(["0x..."]);
 * ```
 */
export function isCreateAssetByIdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAssetById" function.
 * @param options - The options for the createAssetById function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAssetByIdParams } from "thirdweb/extensions/assets";
 * const result = encodeCreateAssetByIdParams({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAssetByIdParams(options: CreateAssetByIdParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.contractId,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "createAssetById" function into a Hex string with its parameters.
 * @param options - The options for the createAssetById function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAssetById } from "thirdweb/extensions/assets";
 * const result = encodeCreateAssetById({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAssetById(options: CreateAssetByIdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAssetByIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAssetById" function on the contract.
 * @param options - The options for the "createAssetById" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAssetById } from "thirdweb/extensions/assets";
 *
 * const transaction = createAssetById({
 *  contract,
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createAssetById(
  options: BaseTransactionOptions<
    | CreateAssetByIdParams
    | {
        asyncParams: () => Promise<CreateAssetByIdParams>;
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
        resolvedOptions.contractId,
        resolvedOptions.creator,
        resolvedOptions.params,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
