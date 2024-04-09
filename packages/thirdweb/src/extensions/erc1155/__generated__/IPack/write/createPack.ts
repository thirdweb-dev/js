import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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

export const FN_SELECTOR = "0x092e6075" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "packId",
  },
  {
    type: "uint256",
    name: "packTotalSupply",
  },
] as const;

/**
 * Encodes the parameters for the "createPack" function.
 * @param options - The options for the createPack function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeCreatePackParams } "thirdweb/extensions/erc1155";
 * const result = encodeCreatePackParams({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeCreatePackParams(options: CreatePackParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.contents,
    options.numOfRewardUnits,
    options.packUri,
    options.openStartTimestamp,
    options.amountDistributedPerOpen,
    options.recipient,
  ]);
}

/**
 * Calls the "createPack" function on the contract.
 * @param options - The options for the "createPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { createPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = createPack({
 *  contract,
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
export function createPack(
  options: BaseTransactionOptions<
    | CreatePackParams
    | {
        asyncParams: () => Promise<CreatePackParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.contents,
              resolvedParams.numOfRewardUnits,
              resolvedParams.packUri,
              resolvedParams.openStartTimestamp,
              resolvedParams.amountDistributedPerOpen,
              resolvedParams.recipient,
            ] as const;
          }
        : [
            options.contents,
            options.numOfRewardUnits,
            options.packUri,
            options.openStartTimestamp,
            options.amountDistributedPerOpen,
            options.recipient,
          ],
  });
}
