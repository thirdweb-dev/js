import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = WithOverrides<{
  name: AbiParameterToPrimitiveType<{ type: "string"; name: "_name" }>;
  contractURI: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_contractURI";
  }>;
  trustedForwarders: AbiParameterToPrimitiveType<{
    type: "address[]";
    name: "_trustedForwarders";
  }>;
  token: AbiParameterToPrimitiveType<{ type: "address"; name: "_token" }>;
  initialVotingDelay: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_initialVotingDelay";
  }>;
  initialVotingPeriod: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_initialVotingPeriod";
  }>;
  initialProposalThreshold: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_initialProposalThreshold";
  }>;
  initialVoteQuorumFraction: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_initialVoteQuorumFraction";
  }>;
}>;

export const FN_SELECTOR = "0x7cf43f8d" as const;
const FN_INPUTS = [
  {
    type: "string",
    name: "_name",
  },
  {
    type: "string",
    name: "_contractURI",
  },
  {
    type: "address[]",
    name: "_trustedForwarders",
  },
  {
    type: "address",
    name: "_token",
  },
  {
    type: "uint256",
    name: "_initialVotingDelay",
  },
  {
    type: "uint256",
    name: "_initialVotingPeriod",
  },
  {
    type: "uint256",
    name: "_initialProposalThreshold",
  },
  {
    type: "uint256",
    name: "_initialVoteQuorumFraction",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `initialize` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `initialize` method is supported.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { isInitializeSupported } from "thirdweb/extensions/prebuilts";
 *
 * const supported = await isInitializeSupported(contract);
 * ```
 */
export async function isInitializeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "initialize" function.
 * @param options - The options for the initialize function.
 * @returns The encoded ABI parameters.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { encodeInitializeParams } "thirdweb/extensions/prebuilts";
 * const result = encodeInitializeParams({
 *  name: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  token: ...,
 *  initialVotingDelay: ...,
 *  initialVotingPeriod: ...,
 *  initialProposalThreshold: ...,
 *  initialVoteQuorumFraction: ...,
 * });
 * ```
 */
export function encodeInitializeParams(options: InitializeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.name,
    options.contractURI,
    options.trustedForwarders,
    options.token,
    options.initialVotingDelay,
    options.initialVotingPeriod,
    options.initialProposalThreshold,
    options.initialVoteQuorumFraction,
  ]);
}

/**
 * Encodes the "initialize" function into a Hex string with its parameters.
 * @param options - The options for the initialize function.
 * @returns The encoded hexadecimal string.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { encodeInitialize } "thirdweb/extensions/prebuilts";
 * const result = encodeInitialize({
 *  name: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  token: ...,
 *  initialVotingDelay: ...,
 *  initialVotingPeriod: ...,
 *  initialProposalThreshold: ...,
 *  initialVoteQuorumFraction: ...,
 * });
 * ```
 */
export function encodeInitialize(options: InitializeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeInitializeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { initialize } from "thirdweb/extensions/prebuilts";
 *
 * const transaction = initialize({
 *  contract,
 *  name: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  token: ...,
 *  initialVotingDelay: ...,
 *  initialVotingPeriod: ...,
 *  initialProposalThreshold: ...,
 *  initialVoteQuorumFraction: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function initialize(
  options: BaseTransactionOptions<
    | InitializeParams
    | {
        asyncParams: () => Promise<InitializeParams>;
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
        resolvedOptions.name,
        resolvedOptions.contractURI,
        resolvedOptions.trustedForwarders,
        resolvedOptions.token,
        resolvedOptions.initialVotingDelay,
        resolvedOptions.initialVotingPeriod,
        resolvedOptions.initialProposalThreshold,
        resolvedOptions.initialVoteQuorumFraction,
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
