import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "propose" function.
 */
export type ProposeParams = WithOverrides<{
  targets: AbiParameterToPrimitiveType<{ type: "address[]"; name: "targets" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
  calldatas: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "calldatas";
  }>;
  description: AbiParameterToPrimitiveType<{
    type: "string";
    name: "description";
  }>;
}>;

export const FN_SELECTOR = "0x7d5e81e2" as const;
const FN_INPUTS = [
  {
    type: "address[]",
    name: "targets",
  },
  {
    type: "uint256[]",
    name: "values",
  },
  {
    type: "bytes[]",
    name: "calldatas",
  },
  {
    type: "string",
    name: "description",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "proposalId",
  },
] as const;

/**
 * Checks if the `propose` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `propose` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposeSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isProposeSupported(["0x..."]);
 * ```
 */
export function isProposeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "propose" function.
 * @param options - The options for the propose function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposeParams } from "thirdweb/extensions/vote";
 * const result = encodeProposeParams({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  description: ...,
 * });
 * ```
 */
export function encodeProposeParams(options: ProposeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.targets,
    options.values,
    options.calldatas,
    options.description,
  ]);
}

/**
 * Encodes the "propose" function into a Hex string with its parameters.
 * @param options - The options for the propose function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodePropose } from "thirdweb/extensions/vote";
 * const result = encodePropose({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  description: ...,
 * });
 * ```
 */
export function encodePropose(options: ProposeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeProposeParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "propose" function on the contract.
 * @param options - The options for the "propose" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { propose } from "thirdweb/extensions/vote";
 *
 * const transaction = propose({
 *  contract,
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  description: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function propose(
  options: BaseTransactionOptions<
    | ProposeParams
    | {
        asyncParams: () => Promise<ProposeParams>;
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
        resolvedOptions.targets,
        resolvedOptions.values,
        resolvedOptions.calldatas,
        resolvedOptions.description,
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
  });
}
