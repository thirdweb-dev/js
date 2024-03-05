import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createPack" function.
 */
export type CreatePackParams = {
  contents: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      {
        internalType: "enum ITokenBundle.TokenType";
        name: "tokenType";
        type: "uint8";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "totalAmount"; type: "uint256" },
    ];
    internalType: "struct ITokenBundle.Token[]";
    name: "contents";
    type: "tuple[]";
  }>;
  numOfRewardUnits: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "numOfRewardUnits";
    type: "uint256[]";
  }>;
  packUri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "packUri";
    type: "string";
  }>;
  openStartTimestamp: AbiParameterToPrimitiveType<{
    internalType: "uint128";
    name: "openStartTimestamp";
    type: "uint128";
  }>;
  amountDistributedPerOpen: AbiParameterToPrimitiveType<{
    internalType: "uint128";
    name: "amountDistributedPerOpen";
    type: "uint128";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
};

/**
 * Calls the createPack function on the contract.
 * @param options - The options for the createPack function.
 * @returns A prepared transaction object.
 * @extension IPACK
 * @example
 * ```
 * import { createPack } from "thirdweb/extensions/IPack";
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
          components: [
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "enum ITokenBundle.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          internalType: "struct ITokenBundle.Token[]",
          name: "contents",
          type: "tuple[]",
        },
        {
          internalType: "uint256[]",
          name: "numOfRewardUnits",
          type: "uint256[]",
        },
        {
          internalType: "string",
          name: "packUri",
          type: "string",
        },
        {
          internalType: "uint128",
          name: "openStartTimestamp",
          type: "uint128",
        },
        {
          internalType: "uint128",
          name: "amountDistributedPerOpen",
          type: "uint128",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "packId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "packTotalSupply",
          type: "uint256",
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
