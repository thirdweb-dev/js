import { getContract } from "../../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { allowance } from "../../../erc20/__generated__/IERC20/read/allowance.js";
import { balanceOf } from "../../../erc20/__generated__/IERC20/read/balanceOf.js";
import {
  type AcceptOfferParams as GeneratedAcceptOfferParams,
  acceptOffer as generatedAcceptOffer,
} from "../../__generated__/IOffers/write/acceptOffer.js";
import { getOffer } from "../read/getOffer.js";

export type AcceptOfferParams = GeneratedAcceptOfferParams;

/**
 * Accepts an offer after performing necessary checks and validations.
 * Throws an error if the offer is not active, the offeror's balance is insufficient,
 * or the offeror's allowance is insufficient.
 *
 * @param options - The options for accepting the offer.
 * @returns A transaction object that can be sent to accept the offer.
 * @throws Error when sending the transaction if the offer is not active, the offeror's balance is insufficient,
 * or the offeror's allowance is insufficient.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const acceptOfferTx = acceptOffer({
 *  contract,
 *  offerId: 1n,
 * });
 * ```
 */
export function acceptOffer(
  options: BaseTransactionOptions<AcceptOfferParams>,
) {
  return generatedAcceptOffer({
    contract: options.contract,
    asyncParams: async () => {
      const offer = await getOffer({
        contract: options.contract,
        offerId: options.offerId,
      });
      if (offer.status !== "ACTIVE") {
        throw new Error("Offer is not active");
      }
      // check that the offeror has sufficient balance and has given approval to the contract
      const currencyContract = getContract({
        address: offer.currencyContractAddress,
        chain: options.contract.chain,
        client: options.contract.client,
      });
      const [offerorBalance, offerorAllowance] = await Promise.all([
        balanceOf({
          contract: currencyContract,
          address: offer.offerorAddress,
        }),
        allowance({
          contract: currencyContract,
          owner: offer.offerorAddress,
          // spender is the marketplace contract
          spender: options.contract.address,
        }),
      ]);
      if (offerorBalance < offer.totalPrice) {
        throw new Error("Offeror balance is insufficient");
      }
      if (offerorAllowance < offer.totalPrice) {
        throw new Error("Offeror allowance is insufficient");
      }
      // if we get here we can accept!
      return { offerId: options.offerId };
    },
  });
}
