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
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = WithOverrides<{
  receiver: AbiParameterToPrimitiveType<{
    name: "_receiver";
    type: "address";
    internalType: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    name: "_quantity";
    type: "uint256";
    internalType: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    name: "_currency";
    type: "address";
    internalType: "address";
  }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    name: "_pricePerToken";
    type: "uint256";
    internalType: "uint256";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    name: "_allowlistProof";
    type: "tuple";
    internalType: "struct IDropSinglePhase.AllowlistProof";
    components: [
      { name: "proof"; type: "bytes32[]"; internalType: "bytes32[]" },
      {
        name: "quantityLimitPerWallet";
        type: "uint256";
        internalType: "uint256";
      },
      { name: "pricePerToken"; type: "uint256"; internalType: "uint256" },
      { name: "currency"; type: "address"; internalType: "address" },
    ];
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0x84bb1e42" as const;
const FN_INPUTS = [
  {
    name: "_receiver",
    type: "address",
    internalType: "address",
  },
  {
    name: "_quantity",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_currency",
    type: "address",
    internalType: "address",
  },
  {
    name: "_pricePerToken",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_allowlistProof",
    type: "tuple",
    internalType: "struct IDropSinglePhase.AllowlistProof",
    components: [
      {
        name: "proof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "quantityLimitPerWallet",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "pricePerToken",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "currency",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claim` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `claim` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isClaimSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isClaimSupported(contract);
 * ```
 */
export async function isClaimSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claim" function.
 * @param options - The options for the claim function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeClaimParams } "thirdweb/extensions/erc20";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.quantity,
    options.currency,
    options.pricePerToken,
    options.allowlistProof,
    options.data,
  ]);
}

/**
 * Encodes the "claim" function into a Hex string with its parameters.
 * @param options - The options for the claim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeClaim } "thirdweb/extensions/erc20";
 * const result = encodeClaim({
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeClaim(options: ClaimParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { claim } from "thirdweb/extensions/erc20";
 *
 * const transaction = claim({
 *  contract,
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(
  options: BaseTransactionOptions<
    | ClaimParams
    | {
        asyncParams: () => Promise<ClaimParams>;
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
        resolvedOptions.receiver,
        resolvedOptions.quantity,
        resolvedOptions.currency,
        resolvedOptions.pricePerToken,
        resolvedOptions.allowlistProof,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
