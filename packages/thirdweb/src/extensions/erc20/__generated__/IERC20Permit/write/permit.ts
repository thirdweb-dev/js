import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "permit" function.
 */

type PermitParamsInternal = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
};

export type PermitParams = Prettify<
  | PermitParamsInternal
  | {
      asyncParams: () => Promise<PermitParamsInternal>;
    }
>;
/**
 * Calls the "permit" function on the contract.
 * @param options - The options for the "permit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { permit } from "thirdweb/extensions/erc20";
 *
 * const transaction = permit({
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function permit(options: BaseTransactionOptions<PermitParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd505accf",
      [
        {
          type: "address",
          name: "owner",
        },
        {
          type: "address",
          name: "spender",
        },
        {
          type: "uint256",
          name: "value",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "uint8",
          name: "v",
        },
        {
          type: "bytes32",
          name: "r",
        },
        {
          type: "bytes32",
          name: "s",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.owner,
              resolvedParams.spender,
              resolvedParams.value,
              resolvedParams.deadline,
              resolvedParams.v,
              resolvedParams.r,
              resolvedParams.s,
            ] as const;
          }
        : [
            options.owner,
            options.spender,
            options.value,
            options.deadline,
            options.v,
            options.r,
            options.s,
          ],
  });
}
