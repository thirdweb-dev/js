import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setBurnToClaimInfo" function.
 */
export type SetBurnToClaimInfoParams = {
  burnToClaimInfo: AbiParameterToPrimitiveType<{
    components: [
      {
        internalType: "address";
        name: "originContractAddress";
        type: "address";
      },
      {
        internalType: "enum IBurnToClaim.TokenType";
        name: "tokenType";
        type: "uint8";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      {
        internalType: "uint256";
        name: "mintPriceForNewToken";
        type: "uint256";
      },
      { internalType: "address"; name: "currency"; type: "address" },
    ];
    internalType: "struct IBurnToClaim.BurnToClaimInfo";
    name: "burnToClaimInfo";
    type: "tuple";
  }>;
};

/**
 * Calls the setBurnToClaimInfo function on the contract.
 * @param options - The options for the setBurnToClaimInfo function.
 * @returns A prepared transaction object.
 * @extension IBURNTOCLAIM
 * @example
 * ```
 * import { setBurnToClaimInfo } from "thirdweb/extensions/IBurnToClaim";
 *
 * const transaction = setBurnToClaimInfo({
 *  burnToClaimInfo: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setBurnToClaimInfo(
  options: BaseTransactionOptions<SetBurnToClaimInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0689b284",
      [
        {
          components: [
            {
              internalType: "address",
              name: "originContractAddress",
              type: "address",
            },
            {
              internalType: "enum IBurnToClaim.TokenType",
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
              name: "mintPriceForNewToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
          ],
          internalType: "struct IBurnToClaim.BurnToClaimInfo",
          name: "burnToClaimInfo",
          type: "tuple",
        },
      ],
      [],
    ],
    params: [options.burnToClaimInfo],
  });
}
