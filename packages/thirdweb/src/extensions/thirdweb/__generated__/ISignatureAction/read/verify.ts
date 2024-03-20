import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verify" function.
 */
export type VerifyParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
      { type: "bytes"; name: "data" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

const METHOD = [
  "0xc4376dd7",
  [
    {
      type: "tuple",
      name: "req",
      components: [
        {
          type: "uint128",
          name: "validityStartTimestamp",
        },
        {
          type: "uint128",
          name: "validityEndTimestamp",
        },
        {
          type: "bytes32",
          name: "uid",
        },
        {
          type: "bytes",
          name: "data",
        },
      ],
    },
    {
      type: "bytes",
      name: "signature",
    },
  ],
  [
    {
      type: "bool",
      name: "success",
    },
    {
      type: "address",
      name: "signer",
    },
  ],
] as const;

/**
 * Calls the "verify" function on the contract.
 * @param options - The options for the verify function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { verify } from "thirdweb/extensions/thirdweb";
 *
 * const result = await verify({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function verify(options: BaseTransactionOptions<VerifyParams>) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.req, options.signature],
  });
}
