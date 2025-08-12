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
 * Represents the parameters for the "permit" function.
 */
export type PermitParams = WithOverrides<{
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
}>;

export const FN_SELECTOR = "0xd505accf" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
  },
  {
    name: "spender",
    type: "address",
  },
  {
    name: "value",
    type: "uint256",
  },
  {
    name: "deadline",
    type: "uint256",
  },
  {
    name: "v",
    type: "uint8",
  },
  {
    name: "r",
    type: "bytes32",
  },
  {
    name: "s",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `permit` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `permit` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isPermitSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isPermitSupported(["0x..."]);
 * ```
 */
export function isPermitSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "permit" function.
 * @param options - The options for the permit function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodePermitParams } from "thirdweb/extensions/erc20";
 * const result = encodePermitParams({
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodePermitParams(options: PermitParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.spender,
    options.value,
    options.deadline,
    options.v,
    options.r,
    options.s,
  ]);
}

/**
 * Encodes the "permit" function into a Hex string with its parameters.
 * @param options - The options for the permit function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodePermit } from "thirdweb/extensions/erc20";
 * const result = encodePermit({
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 * ```
 */
export function encodePermit(options: PermitParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePermitParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "permit" function on the contract.
 * @param options - The options for the "permit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { permit } from "thirdweb/extensions/erc20";
 *
 * const transaction = permit({
 *  contract,
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function permit(
  options: BaseTransactionOptions<
    | PermitParams
    | {
        asyncParams: () => Promise<PermitParams>;
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
        resolvedOptions.owner,
        resolvedOptions.spender,
        resolvedOptions.value,
        resolvedOptions.deadline,
        resolvedOptions.v,
        resolvedOptions.r,
        resolvedOptions.s,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
