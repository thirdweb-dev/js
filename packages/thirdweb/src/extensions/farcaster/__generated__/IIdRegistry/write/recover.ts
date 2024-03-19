import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "recover" function.
 */

type RecoverParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

export type RecoverParams = Prettify<
  | RecoverParamsInternal
  | {
      asyncParams: () => Promise<RecoverParamsInternal>;
    }
>;
/**
 * Calls the "recover" function on the contract.
 * @param options - The options for the "recover" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { recover } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recover({
 *  from: ...,
 *  to: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function recover(options: BaseTransactionOptions<RecoverParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2a42ede3",
      [
        {
          type: "address",
          name: "from",
        },
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.from,
          resolvedParams.to,
          resolvedParams.deadline,
          resolvedParams.sig,
        ] as const;
      }

      return [options.from, options.to, options.deadline, options.sig] as const;
    },
  });
}
