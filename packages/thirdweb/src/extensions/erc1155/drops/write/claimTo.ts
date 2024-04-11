import type { Address } from "abitype";
import { maxUint256 } from "viem";
import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { padHex } from "../../../../utils/encoding/hex.js";
import type { OverrideProof } from "../../../../utils/extensions/drops/types.js";
import { claim } from "../../__generated__/IDrop1155/write/claim.js";
import { getActiveClaimCondition } from "../read/getActiveClaimCondition.js";

export type ClaimToParams = {
  to: Address;
  tokenId: bigint;
  quantity: bigint;
  from?: Address;
};

/**
 * Claim ERC721 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC721
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc1155";
 * const tx = await claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return claim({
    contract: options.contract,
    async asyncParams() {
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });

      // compute the allowListProof in an iife
      const allowlistProof = await (async () => {
        // early exit if no merkle root is set
        if (!cc.merkleRoot || cc.merkleRoot === padHex("0x", { size: 32 })) {
          return {
            currency: ADDRESS_ZERO,
            proof: [],
            quantityLimitPerWallet: 0n,
            pricePerToken: 0n,
          } satisfies OverrideProof;
        }
        // lazy-load the fetchProofsForClaimer function if we need it
        const { fetchProofsForClaimer } = await import(
          "../../../../utils/extensions/drops/fetch-proofs-for-claimers.js"
        );

        const allowListProof = await fetchProofsForClaimer({
          contract: options.contract,
          claimer: options.from || options.to, // receiver and claimer can be different, always prioritize the claimer for allowlists
          merkleRoot: cc.merkleRoot,
          tokenDecimals: 0, // nfts have no decimals
        });
        // if no proof is found, we'll try the empty proof
        if (!allowListProof) {
          return {
            currency: ADDRESS_ZERO,
            proof: [],
            quantityLimitPerWallet: 0n,
            pricePerToken: 0n,
          } satisfies OverrideProof;
        }
        // otherwise return the proof
        return allowListProof;
      })();

      // currency and price need to match the allowlist proof if set
      // if default values in the allowlist proof, fallback to the claim condition
      const currency =
        allowlistProof.currency && allowlistProof.currency !== ADDRESS_ZERO
          ? allowlistProof.currency
          : cc.currency;
      const pricePerToken =
        allowlistProof.pricePerToken &&
        allowlistProof.pricePerToken !== maxUint256
          ? allowlistProof.pricePerToken
          : cc.pricePerToken;

      return {
        receiver: options.to,
        tokenId: options.tokenId,
        quantity: options.quantity,
        currency,
        pricePerToken,
        allowlistProof,
        data: "0x",
        overrides: {
          value: isNativeTokenAddress(currency)
            ? pricePerToken * BigInt(options.quantity)
            : 0n,
        },
      };
    },
  });
}
