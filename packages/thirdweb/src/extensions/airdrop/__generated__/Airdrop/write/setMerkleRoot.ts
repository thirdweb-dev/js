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
 * Represents the parameters for the "setMerkleRoot" function.
 */
export type SetMerkleRootParams = WithOverrides<{
  token: AbiParameterToPrimitiveType<{ type: "address"; name: "_token" }>;
  tokenMerkleRoot: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "_tokenMerkleRoot";
  }>;
  resetClaimStatus: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "_resetClaimStatus";
  }>;
}>;

export const FN_SELECTOR = "0x8259a87b" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_token",
  },
  {
    type: "bytes32",
    name: "_tokenMerkleRoot",
  },
  {
    type: "bool",
    name: "_resetClaimStatus",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setMerkleRoot` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setMerkleRoot` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isSetMerkleRootSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = isSetMerkleRootSupported(["0x..."]);
 * ```
 */
export function isSetMerkleRootSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setMerkleRoot" function.
 * @param options - The options for the setMerkleRoot function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeSetMerkleRootParams } "thirdweb/extensions/airdrop";
 * const result = encodeSetMerkleRootParams({
 *  token: ...,
 *  tokenMerkleRoot: ...,
 *  resetClaimStatus: ...,
 * });
 * ```
 */
export function encodeSetMerkleRootParams(options: SetMerkleRootParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.token,
    options.tokenMerkleRoot,
    options.resetClaimStatus,
  ]);
}

/**
 * Encodes the "setMerkleRoot" function into a Hex string with its parameters.
 * @param options - The options for the setMerkleRoot function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeSetMerkleRoot } "thirdweb/extensions/airdrop";
 * const result = encodeSetMerkleRoot({
 *  token: ...,
 *  tokenMerkleRoot: ...,
 *  resetClaimStatus: ...,
 * });
 * ```
 */
export function encodeSetMerkleRoot(options: SetMerkleRootParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetMerkleRootParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setMerkleRoot" function on the contract.
 * @param options - The options for the "setMerkleRoot" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { setMerkleRoot } from "thirdweb/extensions/airdrop";
 *
 * const transaction = setMerkleRoot({
 *  contract,
 *  token: ...,
 *  tokenMerkleRoot: ...,
 *  resetClaimStatus: ...,
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
export function setMerkleRoot(
  options: BaseTransactionOptions<
    | SetMerkleRootParams
    | {
        asyncParams: () => Promise<SetMerkleRootParams>;
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
        resolvedOptions.token,
        resolvedOptions.tokenMerkleRoot,
        resolvedOptions.resetClaimStatus,
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
