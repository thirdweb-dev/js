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
 * Represents the parameters for the "createAccountWithModules" function.
 */
export type CreateAccountWithModulesParams = WithOverrides<{
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes"; name: "salt" }>;
  modules: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "modules";
    components: [
      { type: "uint256"; name: "moduleTypeId" },
      { type: "address"; name: "module" },
      { type: "bytes"; name: "initData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x7c37d0dc" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
  },
  {
    name: "salt",
    type: "bytes",
  },
  {
    components: [
      {
        name: "moduleTypeId",
        type: "uint256",
      },
      {
        name: "module",
        type: "address",
      },
      {
        name: "initData",
        type: "bytes",
      },
    ],
    name: "modules",
    type: "tuple[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `createAccountWithModules` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAccountWithModules` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isCreateAccountWithModulesSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isCreateAccountWithModulesSupported(["0x..."]);
 * ```
 */
export function isCreateAccountWithModulesSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAccountWithModules" function.
 * @param options - The options for the createAccountWithModules function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeCreateAccountWithModulesParams } from "thirdweb/extensions/erc7579";
 * const result = encodeCreateAccountWithModulesParams({
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 * });
 * ```
 */
export function encodeCreateAccountWithModulesParams(
  options: CreateAccountWithModulesParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.salt,
    options.modules,
  ]);
}

/**
 * Encodes the "createAccountWithModules" function into a Hex string with its parameters.
 * @param options - The options for the createAccountWithModules function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeCreateAccountWithModules } from "thirdweb/extensions/erc7579";
 * const result = encodeCreateAccountWithModules({
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 * });
 * ```
 */
export function encodeCreateAccountWithModules(
  options: CreateAccountWithModulesParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAccountWithModulesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAccountWithModules" function on the contract.
 * @param options - The options for the "createAccountWithModules" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAccountWithModules } from "thirdweb/extensions/erc7579";
 *
 * const transaction = createAccountWithModules({
 *  contract,
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createAccountWithModules(
  options: BaseTransactionOptions<
    | CreateAccountWithModulesParams
    | {
        asyncParams: () => Promise<CreateAccountWithModulesParams>;
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
        resolvedOptions.salt,
        resolvedOptions.modules,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
