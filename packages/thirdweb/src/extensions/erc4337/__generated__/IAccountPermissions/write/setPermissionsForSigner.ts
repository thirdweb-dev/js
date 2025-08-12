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
 * Represents the parameters for the "setPermissionsForSigner" function.
 */
export type SetPermissionsForSignerParams = WithOverrides<{
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "signer" },
      { type: "uint8"; name: "isAdmin" },
      { type: "address[]"; name: "approvedTargets" },
      { type: "uint256"; name: "nativeTokenLimitPerTransaction" },
      { type: "uint128"; name: "permissionStartTimestamp" },
      { type: "uint128"; name: "permissionEndTimestamp" },
      { type: "uint128"; name: "reqValidityStartTimestamp" },
      { type: "uint128"; name: "reqValidityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0x5892e236" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "signer",
        type: "address",
      },
      {
        name: "isAdmin",
        type: "uint8",
      },
      {
        name: "approvedTargets",
        type: "address[]",
      },
      {
        name: "nativeTokenLimitPerTransaction",
        type: "uint256",
      },
      {
        name: "permissionStartTimestamp",
        type: "uint128",
      },
      {
        name: "permissionEndTimestamp",
        type: "uint128",
      },
      {
        name: "reqValidityStartTimestamp",
        type: "uint128",
      },
      {
        name: "reqValidityEndTimestamp",
        type: "uint128",
      },
      {
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "req",
    type: "tuple",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setPermissionsForSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setPermissionsForSigner` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isSetPermissionsForSignerSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isSetPermissionsForSignerSupported(["0x..."]);
 * ```
 */
export function isSetPermissionsForSignerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setPermissionsForSigner" function.
 * @param options - The options for the setPermissionsForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSetPermissionsForSignerParams } from "thirdweb/extensions/erc4337";
 * const result = encodeSetPermissionsForSignerParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeSetPermissionsForSignerParams(
  options: SetPermissionsForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Encodes the "setPermissionsForSigner" function into a Hex string with its parameters.
 * @param options - The options for the setPermissionsForSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSetPermissionsForSigner } from "thirdweb/extensions/erc4337";
 * const result = encodeSetPermissionsForSigner({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeSetPermissionsForSigner(
  options: SetPermissionsForSignerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetPermissionsForSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setPermissionsForSigner" function on the contract.
 * @param options - The options for the "setPermissionsForSigner" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setPermissionsForSigner } from "thirdweb/extensions/erc4337";
 *
 * const transaction = setPermissionsForSigner({
 *  contract,
 *  req: ...,
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
export function setPermissionsForSigner(
  options: BaseTransactionOptions<
    | SetPermissionsForSignerParams
    | {
        asyncParams: () => Promise<SetPermissionsForSignerParams>;
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
      return [resolvedOptions.req, resolvedOptions.signature] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
