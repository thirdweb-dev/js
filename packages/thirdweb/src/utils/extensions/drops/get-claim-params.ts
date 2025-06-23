import { maxUint256, padHex } from "viem";
import {
  isNativeTokenAddress,
  ZERO_ADDRESS,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getContractMetadata } from "../../../extensions/common/read/getContractMetadata.js";
import type { Hex } from "../../encoding/hex.js";
import type { ClaimCondition, OverrideProof } from "./types.js";

export type GetClaimParamsOptions = {
  contract: ThirdwebContract;
  to: string;
  quantity: bigint;
  from?: string;
  singlePhaseDrop?: boolean;
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
 * @example
 * ```ts
 * import { getClaimParams } from "thirdweb/utils";
 *
 * const claimParams = await getClaimParams({
 *  contract,
 *  to: "0x...",
 *  quantity: 1n,
 *  type: "erc1155",
 *  tokenId: 0n,
 * });
 * ```
 * @utils
 */
export async function getClaimParams(options: GetClaimParamsOptions) {
  const cc: ClaimCondition = await (async () => {
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
      if (options.singlePhaseDrop) {
        const { claimCondition } = await import(
          "../../../extensions/erc721/__generated__/IDropSinglePhase/read/claimCondition.js"
        );
        return await claimCondition({
          contract: options.contract,
        });
      }
      const { getActiveClaimCondition } = await import(
        "../../../extensions/erc721/drops/read/getActiveClaimCondition.js"
      );
      return await getActiveClaimCondition({
        contract: options.contract,
      });
    }

    // otherwise erc20 case!

    // lazy-load the getActiveClaimCondition function
    if (options.singlePhaseDrop) {
      // same ABI as erc721
      const { claimCondition } = await import(
        "../../../extensions/erc721/__generated__/IDropSinglePhase/read/claimCondition.js"
      );
      return await claimCondition({
        contract: options.contract,
      });
    }
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
        currency: ZERO_ADDRESS,
        pricePerToken: maxUint256,
        proof: [],
        quantityLimitPerWallet: 0n,
      } satisfies OverrideProof;
    }
    // lazy-load the fetchProofsForClaimer function if we need it
    const { fetchProofsForClaimer } = await import(
      "./fetch-proofs-for-claimers.js"
    );

    // 1. fetch merkle data from contract URI
    const metadata = await getContractMetadata({
      contract: options.contract,
    });
    const merkleData: Record<string, string> = metadata.merkle || {};
    const snapshotUri = merkleData[cc.merkleRoot];

    if (!snapshotUri) {
      return {
        currency: ZERO_ADDRESS,
        pricePerToken: maxUint256,
        proof: [],
        quantityLimitPerWallet: 0n,
      } satisfies OverrideProof;
    }

    const allowListProof = await fetchProofsForClaimer({
      claimer: options.from || options.to,
      contract: options.contract, // receiver and claimer can be different, always prioritize the claimer for allowlists
      merkleTreeUri: snapshotUri,
      tokenDecimals,
    });
    // if no proof is found, we'll try the empty proof
    if (!allowListProof) {
      return {
        currency: ZERO_ADDRESS,
        pricePerToken: maxUint256,
        proof: [],
        quantityLimitPerWallet: 0n,
      } satisfies OverrideProof;
    }
    // otherwise return the proof
    return allowListProof;
  })();

  // currency and price need to match the allowlist proof if set
  // if default values in the allowlist proof, fallback to the claim condition
  const currency =
    allowlistProof.currency && allowlistProof.currency !== ZERO_ADDRESS
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
    allowlistProof,
    currency,
    data: "0x" as Hex,
    overrides: {
      erc20Value,
      value,
    },
    pricePerToken,
    quantity: options.quantity,
    receiver: options.to,
    tokenId: options.type === "erc1155" ? options.tokenId : undefined,
  };
}
