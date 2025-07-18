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
 * Represents the parameters for the "createMarket" function.
 */
export type CreateMarketParams = WithOverrides<{
  createMarketConfig: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "createMarketConfig";
    components: [
      { type: "address"; name: "creator" },
      { type: "address"; name: "tokenIn" },
      { type: "address"; name: "tokenOut" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "uint8"; name: "priceDenominator" },
      { type: "uint256"; name: "totalSupply" },
      { type: "uint48"; name: "startTime" },
      { type: "uint48"; name: "endTime" },
      { type: "uint256"; name: "tokenId" },
      { type: "address"; name: "hook" },
      { type: "bytes"; name: "createHookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xc6d6be45" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "createMarketConfig",
    components: [
      {
        type: "address",
        name: "creator",
      },
      {
        type: "address",
        name: "tokenIn",
      },
      {
        type: "address",
        name: "tokenOut",
      },
      {
        type: "uint256",
        name: "pricePerUnit",
      },
      {
        type: "uint8",
        name: "priceDenominator",
      },
      {
        type: "uint256",
        name: "totalSupply",
      },
      {
        type: "uint48",
        name: "startTime",
      },
      {
        type: "uint48",
        name: "endTime",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "address",
        name: "hook",
      },
      {
        type: "bytes",
        name: "createHookData",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "sale",
  },
  {
    type: "address",
    name: "position",
  },
  {
    type: "uint256",
    name: "positionId",
  },
] as const;

/**
 * Checks if the `createMarket` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createMarket` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isCreateMarketSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isCreateMarketSupported(["0x..."]);
 * ```
 */
export function isCreateMarketSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createMarket" function.
 * @param options - The options for the createMarket function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateMarketParams } from "thirdweb/extensions/assets";
 * const result = encodeCreateMarketParams({
 *  createMarketConfig: ...,
 * });
 * ```
 */
export function encodeCreateMarketParams(options: CreateMarketParams) {
  return encodeAbiParameters(FN_INPUTS, [options.createMarketConfig]);
}

/**
 * Encodes the "createMarket" function into a Hex string with its parameters.
 * @param options - The options for the createMarket function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateMarket } from "thirdweb/extensions/assets";
 * const result = encodeCreateMarket({
 *  createMarketConfig: ...,
 * });
 * ```
 */
export function encodeCreateMarket(options: CreateMarketParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateMarketParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createMarket" function on the contract.
 * @param options - The options for the "createMarket" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createMarket } from "thirdweb/extensions/assets";
 *
 * const transaction = createMarket({
 *  contract,
 *  createMarketConfig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createMarket(
  options: BaseTransactionOptions<
    | CreateMarketParams
    | {
        asyncParams: () => Promise<CreateMarketParams>;
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
      return [resolvedOptions.createMarketConfig] as const;
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
