import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getMulticallSetClaimConditionTransactions } from "../../../../utils/extensions/drops/get-multicall-set-claim-claim-conditon-transactions.js";
import type { ClaimConditionsInput } from "../../../../utils/extensions/drops/types.js";
import { isSetContractURISupported } from "../../../common/__generated__/IContractMetadata/write/setContractURI.js";
import {
  isMulticallSupported,
  multicall,
} from "../../../common/__generated__/IMulticall/write/multicall.js";
import { isGetContractMetadataSupported } from "../../../common/read/getContractMetadata.js";
import { isSetClaimConditionsSupported as isSetClaimConditionsSupportedGenerated } from "../../__generated__/IDrop1155/write/setClaimConditions.js";
import { isSetClaimConditionsSupported as isSetClaimConditionsSupportedGeneratedSinglePhase } from "../../__generated__/IDropSinglePhase1155/write/setClaimConditions.js";

/**
 * @extension ERC1155
 */
export type SetClaimConditionsParams = {
  tokenId: bigint;
  phases: ClaimConditionsInput[];
  resetClaimEligibility?: boolean;
  singlePhaseDrop?: boolean;
};

/**
 * Set the claim conditions for a ERC1155 drop
 * This method is only available on the `DropERC1155` contract.
 * @param options
 * @returns the prepared transaction
 * @extension ERC1155
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/erc1155";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  tokenId: 0n,
 *  phases: [
 *    {
 *      maxClaimableSupply: 100n,
 *      maxClaimablePerWallet: 1n,
 *      currencyAddress: "0x...",
 *      price: 0.1,
 *      startTime: new Date(),
 *    },
 *   ],
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setClaimConditions(
  options: BaseTransactionOptions<SetClaimConditionsParams>,
) {
  return multicall({
    asyncParams: async () => {
      return {
        data: await getMulticallSetClaimConditionTransactions({
          contract: options.contract,
          phases: options.phases,
          resetClaimEligibility: options.resetClaimEligibility,
          singlePhase: options.singlePhaseDrop,
          tokenDecimals: 0,
          tokenId: options.tokenId,
        }),
      };
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `setClaimConditions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setClaimConditions` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isSetClaimConditionsSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isSetClaimConditionsSupported(["0x..."]);
 * ```
 */
export function isSetClaimConditionsSupported(availableSelectors: string[]) {
  return (
    isMulticallSupported(availableSelectors) &&
    // needed for setting contract metadata
    isGetContractMetadataSupported(availableSelectors) &&
    isSetContractURISupported(availableSelectors) &&
    // needs to actually be able to set the claim Conditions
    (isSetClaimConditionsSupportedGenerated(availableSelectors) ||
      isSetClaimConditionsSupportedGeneratedSinglePhase(availableSelectors))
  );
}
