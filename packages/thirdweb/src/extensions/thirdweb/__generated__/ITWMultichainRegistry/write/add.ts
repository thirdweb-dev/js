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
 * Represents the parameters for the "add" function.
 */
export type AddParams = WithOverrides<{
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
  metadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "metadataUri";
  }>;
}>;

export const FN_SELECTOR = "0x26c5b516" as const;
const FN_INPUTS = [
  {
    name: "_deployer",
    type: "address",
  },
  {
    name: "_deployment",
    type: "address",
  },
  {
    name: "_chainId",
    type: "uint256",
  },
  {
    name: "metadataUri",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `add` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `add` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isAddSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isAddSupported(["0x..."]);
 * ```
 */
export function isAddSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "add" function.
 * @param options - The options for the add function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeAddParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeAddParams({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 *  metadataUri: ...,
 * });
 * ```
 */
export function encodeAddParams(options: AddParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.deployer,
    options.deployment,
    options.chainId,
    options.metadataUri,
  ]);
}

/**
 * Encodes the "add" function into a Hex string with its parameters.
 * @param options - The options for the add function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeAdd } from "thirdweb/extensions/thirdweb";
 * const result = encodeAdd({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 *  metadataUri: ...,
 * });
 * ```
 */
export function encodeAdd(options: AddParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "add" function on the contract.
 * @param options - The options for the "add" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { add } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = add({
 *  contract,
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 *  metadataUri: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function add(
  options: BaseTransactionOptions<
    | AddParams
    | {
        asyncParams: () => Promise<AddParams>;
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
        resolvedOptions.deployer,
        resolvedOptions.deployment,
        resolvedOptions.chainId,
        resolvedOptions.metadataUri,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
