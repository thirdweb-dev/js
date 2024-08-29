import { maxUint256, padHex } from "viem";
import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { Hex } from "../../encoding/hex.js";
import type { OverrideProof } from "./types.js";

export type GetClaimParamsOptions = {
  contract: ThirdwebContract;
  to: string;
  quantity: bigint;
  from?: string;
} & (
  | {
      type: "erc721";
    }
  | {
      type: "erc20";
      tokenDecimals: number;
    }
  | {
      type: "erc1155";
      tokenId: bigint;
    }
);

/**
 * Get the claim parameters for a given drop
 * @param options - The options for getting the claim parameters
 * @returns The claim parameters
 * @extension ERC1155
 * @example
 * ```ts
 * import { getClaimParams } from "thirdweb/extensions/erc1155";
 *
 * const claimParams = await getClaimParams({
 *  contract,
 *  to: "0x...",
 *  quantity: 1n,
 *  type: "erc1155",
 *  tokenId: 0n,
 * });
 * ```
 * @extension COMMON
 */
export async function getClaimParams(options: GetClaimParamsOptions) {
  const cc = await (async () => {
    if (options.type === "erc1155") {
      // lazy-load the getActiveClaimCondition function
      const { getActiveClaimCondition } = await import(
        "../../../extensions/erc1155/drops/read/getActiveClaimCondition.js"
      );
      return await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
    }
    if (options.type === "erc721") {
      // lazy-load the getActiveClaimCondition function
      const { getActiveClaimCondition } = await import(
        "../../../extensions/erc721/drops/read/getActiveClaimCondition.js"
      );
      return await getActiveClaimCondition({
        contract: options.contract,
      });
    }

    // otherwise erc20 case!

    // lazy-load the getActiveClaimCondition function
    const { getActiveClaimCondition } = await import(
      "../../../extensions/erc20/drops/read/getActiveClaimCondition.js"
    );
    return await getActiveClaimCondition({
      contract: options.contract,
    });
  })();

  const tokenDecimals = options.type === "erc20" ? options.tokenDecimals : 0; // nfts have no decimals

  // compute the allowListProof in an iife
  const allowlistProof = await (async () => {
    // early exit if no merkle root is set
    if (!cc.merkleRoot || cc.merkleRoot === padHex("0x", { size: 32 })) {
      return {
        currency: ADDRESS_ZERO,
        proof: [],
        quantityLimitPerWallet: 0n,
        pricePerToken: maxUint256,
      } satisfies OverrideProof;
    }
    // lazy-load the fetchProofsForClaimer function if we need it
    const { fetchProofsForClaimer } = await import(
      "./fetch-proofs-for-claimers.js"
    );

    const allowListProof = await fetchProofsForClaimer({
      contract: options.contract,
      claimer: options.from || options.to, // receiver and claimer can be different, always prioritize the claimer for allowlists
      merkleRoot: cc.merkleRoot,
      tokenDecimals,
    });
    // if no proof is found, we'll try the empty proof
    if (!allowListProof) {
      return {
        currency: ADDRESS_ZERO,
        proof: [],
        quantityLimitPerWallet: 0n,
        pricePerToken: maxUint256,
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
    allowlistProof.pricePerToken !== undefined &&
    allowlistProof.pricePerToken !== maxUint256
      ? allowlistProof.pricePerToken
      : cc.pricePerToken;

  const totalPrice =
    (pricePerToken * options.quantity) / BigInt(10 ** tokenDecimals);
  const value = isNativeTokenAddress(currency) ? totalPrice : 0n;
  const erc20Value =
    !isNativeTokenAddress(currency) && pricePerToken > 0n
      ? {
          amountWei: totalPrice,
          tokenAddress: currency,
        }
      : undefined;

  return {
    receiver: options.to,
    tokenId: options.type === "erc1155" ? options.tokenId : undefined,
    quantity: options.quantity,
    currency,
    pricePerToken,
    allowlistProof,
    data: "0x" as Hex,
    overrides: {
      value,
      erc20Value,
    },
  };
}
