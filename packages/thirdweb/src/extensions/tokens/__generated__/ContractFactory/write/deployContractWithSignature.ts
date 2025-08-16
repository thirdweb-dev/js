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
 * Represents the parameters for the "deployContractWithSignature" function.
 */
export type DeployContractWithSignatureParams = WithOverrides<{
  request: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "request";
    components: [
      { type: "bytes32"; name: "id" },
      { type: "uint8"; name: "deployType" },
      { type: "bytes"; name: "bytecode" },
      { type: "bytes"; name: "constructorArgs" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes[]"; name: "postDeployCalls" },
      { type: "uint256"; name: "nonce" },
      { type: "uint256"; name: "deadline" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xe4d59447" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "request",
    components: [
      {
        type: "bytes32",
        name: "id",
      },
      {
        type: "uint8",
        name: "deployType",
      },
      {
        type: "bytes",
        name: "bytecode",
      },
      {
        type: "bytes",
        name: "constructorArgs",
      },
      {
        type: "bytes32",
        name: "salt",
      },
      {
        type: "bytes[]",
        name: "postDeployCalls",
      },
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "uint256",
        name: "deadline",
      },
    ],
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "deployed",
  },
] as const;

/**
 * Checks if the `deployContractWithSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployContractWithSignature` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isDeployContractWithSignatureSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isDeployContractWithSignatureSupported(["0x..."]);
 * ```
 */
export function isDeployContractWithSignatureSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployContractWithSignature" function.
 * @param options - The options for the deployContractWithSignature function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployContractWithSignatureParams } from "thirdweb/extensions/tokens";
 * const result = encodeDeployContractWithSignatureParams({
 *  request: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeDeployContractWithSignatureParams(
  options: DeployContractWithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.request, options.signature]);
}

/**
 * Encodes the "deployContractWithSignature" function into a Hex string with its parameters.
 * @param options - The options for the deployContractWithSignature function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployContractWithSignature } from "thirdweb/extensions/tokens";
 * const result = encodeDeployContractWithSignature({
 *  request: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeDeployContractWithSignature(
  options: DeployContractWithSignatureParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployContractWithSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployContractWithSignature" function on the contract.
 * @param options - The options for the "deployContractWithSignature" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployContractWithSignature } from "thirdweb/extensions/tokens";
 *
 * const transaction = deployContractWithSignature({
 *  contract,
 *  request: ...,
 *  signature: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deployContractWithSignature(
  options: BaseTransactionOptions<
    | DeployContractWithSignatureParams
    | {
        asyncParams: () => Promise<DeployContractWithSignatureParams>;
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
      return [resolvedOptions.request, resolvedOptions.signature] as const;
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
