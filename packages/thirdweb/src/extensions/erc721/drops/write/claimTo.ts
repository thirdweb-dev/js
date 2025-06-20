import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { isGetContractMetadataSupported } from "../../../common/read/getContractMetadata.js";
import {
  claim,
  isClaimSupported,
} from "../../__generated__/IDrop/write/claim.js";
import { isClaimConditionSupported } from "../../__generated__/IDropSinglePhase/read/claimCondition.js";
import { isGetActiveClaimConditionSupported } from "../read/getActiveClaimCondition.js";

/**
 * Represents the parameters for claiming an ERC721 token.
 * @extension ERC721
 */
export type ClaimToParams = {
  to: Address;
  quantity: bigint;
  from?: Address;
  singlePhaseDrop?: boolean;
};

/**
 * Claim ERC721 NFTs to a specified address
 * This method is only available on the `DropERC721` contract.
 * @param options - The options for the transaction
 * @extension ERC721
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc721";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 *
 * ### For Drops with allowlists
 * You need to specify the claimer address as the `from` param to avoid any issue with the allowlist
 * ```ts
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 *   from: "0x...", // address of the one claiming
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return claim({
    asyncParams: () =>
      getClaimParams({
        contract: options.contract,
        from: options.from,
        quantity: options.quantity,
        singlePhaseDrop: options.singlePhaseDrop,
        to: options.to,
        type: "erc721",
      }),
    contract: options.contract,
  });
}

/**
 * Checks if the `claimTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimTo` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isClaimToSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isClaimToSupported(["0x..."]);
 * ```
 */
export function isClaimToSupported(availableSelectors: string[]) {
  return (
    isClaimSupported(availableSelectors) &&
    // requires contractMetadata for claimer proofs
    isGetContractMetadataSupported(availableSelectors) &&
    // required to check if the contract supports the getActiveClaimCondition method
    (isGetActiveClaimConditionSupported(availableSelectors) ||
      isClaimConditionSupported(availableSelectors))
  );
}
