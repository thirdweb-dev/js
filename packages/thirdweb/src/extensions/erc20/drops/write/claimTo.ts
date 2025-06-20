import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { isGetContractMetadataSupported } from "../../../common/read/getContractMetadata.js";
import * as GeneratedClaim from "../../__generated__/IDropERC20/write/claim.js";
import { decimals, isDecimalsSupported } from "../../read/decimals.js";
import { isGetActiveClaimConditionSupported } from "../read/getActiveClaimCondition.js";

/**
 * Represents the parameters for claiming an ERC20 token.
 * @extension ERC20
 */
export type ClaimToParams = {
  to: Address;
  from?: Address;
  singlePhaseDrop?: boolean;
} & ({ quantityInWei: bigint } | { quantity: string });

/**
 * Claim ERC20 NFTs to a specified address
 * This method is only available on the `DropERC20` contract.
 *
 * @param options - The options for the transaction
 * @extension ERC20
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc20";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 100n,
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
 *   quantity: 100n,
 *   from: "0x...", // address of the one claiming
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return GeneratedClaim.claim({
    asyncParams: async () => {
      const quantity = await (async () => {
        if ("quantityInWei" in options) {
          return options.quantityInWei;
        }

        const { toUnits } = await import("../../../../utils/units.js");
        return toUnits(
          options.quantity,
          await decimals({ contract: options.contract }),
        );
      })();

      return getClaimParams({
        contract: options.contract,
        from: options.from,
        quantity,
        singlePhaseDrop: options.singlePhaseDrop,
        to: options.to,
        tokenDecimals: await decimals({ contract: options.contract }),
        type: "erc20",
      });
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `claimTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimTo` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isClaimToSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isClaimToSupported(["0x..."]);
 * ```
 */
export function isClaimToSupported(availableSelectors: string[]) {
  return [
    // has to support the claim method
    GeneratedClaim.isClaimSupported(availableSelectors),
    // has to support the getActiveClaimCondition method
    isGetActiveClaimConditionSupported(availableSelectors),
    // has to support the decimals method
    isDecimalsSupported(availableSelectors),
    // requires contractMetadata for claimer proofs
    isGetContractMetadataSupported(availableSelectors),
  ].every(Boolean);
}
