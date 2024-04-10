import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "redeem" function.
 */
export type RedeemParams = WithValue<{
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0xba087652" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "receiver",
    type: "address",
    internalType: "address",
  },
  {
    name: "owner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "redeem" function.
 * @param options - The options for the redeem function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeRedeemParams } "thirdweb/extensions/erc4626";
 * const result = encodeRedeemParams({
 *  shares: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 * ```
 */
export function encodeRedeemParams(options: RedeemParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.shares,
    options.receiver,
    options.owner,
  ]);
}

/**
 * Calls the "redeem" function on the contract.
 * @param options - The options for the "redeem" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { redeem } from "thirdweb/extensions/erc4626";
 *
 * const transaction = redeem({
 *  contract,
 *  shares: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function redeem(
  options: BaseTransactionOptions<
    | RedeemParams
    | {
        asyncParams: () => Promise<RedeemParams>;
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
      const resolvedParams = await asyncOptions();
      return [
        resolvedParams.shares,
        resolvedParams.receiver,
        resolvedParams.owner,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
