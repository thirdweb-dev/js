import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verify" function.
 */
export type VerifyParams = {
  req: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "to"; type: "address" },
      {
        internalType: "address";
        name: "primarySaleRecipient";
        type: "address";
      },
      { internalType: "uint256"; name: "quantity"; type: "uint256" },
      { internalType: "uint256"; name: "price"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      {
        internalType: "uint128";
        name: "validityStartTimestamp";
        type: "uint128";
      },
      {
        internalType: "uint128";
        name: "validityEndTimestamp";
        type: "uint128";
      },
      { internalType: "bytes32"; name: "uid"; type: "bytes32" },
    ];
    internalType: "struct ISignatureMintERC20.MintRequest";
    name: "req";
    type: "tuple";
  }>;
  signature: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "signature";
    type: "bytes";
  }>;
};

/**
 * Calls the "verify" function on the contract.
 * @param options - The options for the verify function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { verify } from "thirdweb/extensions/erc20";
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
    method: [
      "0xc1b606e2",
      [
        {
          components: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "address",
              name: "primarySaleRecipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "uint128",
              name: "validityStartTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "validityEndTimestamp",
              type: "uint128",
            },
            {
              internalType: "bytes32",
              name: "uid",
              type: "bytes32",
            },
          ],
          internalType: "struct ISignatureMintERC20.MintRequest",
          name: "req",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
      ],
    ],
    params: [options.req, options.signature],
  });
}
