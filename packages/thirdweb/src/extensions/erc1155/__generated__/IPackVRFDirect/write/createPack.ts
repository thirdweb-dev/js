import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createPack" function.
 */
export type CreatePackParams = {
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "totalAmount" },
    ];
  }>;
  numOfRewardUnits: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "numOfRewardUnits";
  }>;
  packUri: AbiParameterToPrimitiveType<{ type: "string"; name: "packUri" }>;
  openStartTimestamp: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "openStartTimestamp";
  }>;
  amountDistributedPerOpen: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "amountDistributedPerOpen";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
  }>;
};

/**
 * Calls the "createPack" function on the contract.
 * @param options - The options for the "createPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { createPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = createPack({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createPack(options: BaseTransactionOptions<CreatePackParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x092e6075",
      [
        {
          type: "tuple[]",
          name: "contents",
          components: [
            {
              type: "address",
              name: "assetContract",
            },
            {
              type: "uint8",
              name: "tokenType",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "uint256",
              name: "totalAmount",
            },
          ],
        },
        {
          type: "uint256[]",
          name: "numOfRewardUnits",
        },
        {
          type: "string",
          name: "packUri",
        },
        {
          type: "uint128",
          name: "openStartTimestamp",
        },
        {
          type: "uint128",
          name: "amountDistributedPerOpen",
        },
        {
          type: "address",
          name: "recipient",
        },
      ],
      [
        {
          type: "uint256",
          name: "packId",
        },
        {
          type: "uint256",
          name: "packTotalSupply",
        },
      ],
    ],
    params: [
      options.contents,
      options.numOfRewardUnits,
      options.packUri,
      options.openStartTimestamp,
      options.amountDistributedPerOpen,
      options.recipient,
    ],
  });
}
