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
 * Represents the parameters for the "createById" function.
 */
export type CreateByIdParams = WithOverrides<{
  contractId: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "contractId";
  }>;
  creator: AbiParameterToPrimitiveType<{ type: "address"; name: "creator" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "developer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1889d488" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "contractId",
  },
  {
    type: "address",
    name: "creator",
  },
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "address",
        name: "developer",
      },
      {
        type: "bytes32",
        name: "salt",
      },
      {
        type: "bytes",
        name: "data",
      },
      {
        type: "bytes",
        name: "hookData",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "asset",
  },
] as const;

/**
 * Checks if the `createById` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createById` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isCreateByIdSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isCreateByIdSupported(["0x..."]);
 * ```
 */
export function isCreateByIdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createById" function.
 * @param options - The options for the createById function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCreateByIdParams } from "thirdweb/extensions/tokens";
 * const result = encodeCreateByIdParams({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateByIdParams(options: CreateByIdParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.contractId,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "createById" function into a Hex string with its parameters.
 * @param options - The options for the createById function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCreateById } from "thirdweb/extensions/tokens";
 * const result = encodeCreateById({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateById(options: CreateByIdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateByIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createById" function on the contract.
 * @param options - The options for the "createById" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createById } from "thirdweb/extensions/tokens";
 *
 * const transaction = createById({
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
export function createById(
  options: BaseTransactionOptions<
    | CreateByIdParams
    | {
        asyncParams: () => Promise<CreateByIdParams>;
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
        resolvedOptions.contractId,
        resolvedOptions.creator,
        resolvedOptions.params,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
