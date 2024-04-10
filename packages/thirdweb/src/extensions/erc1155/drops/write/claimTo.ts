import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { padHex } from "../../../../utils/encoding/hex.js";
import { getActiveClaimCondition } from "../read/getActiveClaimCondition.js";
import { fetchProofsForClaimer } from "../utils.js";

const CLAIM_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "receiver",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "tokenId",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "quantity",
      type: "uint256",
    },
    {
      internalType: "address",
      name: "currency",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "pricePerToken",
      type: "uint256",
    },
    {
      components: [
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "quantityLimitPerWallet",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "pricePerToken",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "currency",
          type: "address",
        },
      ],
      internalType: "struct IDrop.AllowlistProof",
      name: "allowlistProof",
      type: "tuple",
    },
    {
      internalType: "bytes",
      name: "data",
      type: "bytes",
    },
  ],
  name: "claim",
  outputs: [],
  stateMutability: "payable",
  type: "function",
} as const;

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
  return prepareContractCall({
    contract: options.contract,
    method: CLAIM_ABI,
    params: async () => {
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      let proofData = {
        currency: cc.currency,
        proof: [] as `0x${string}`[],
        quantityLimitPerWallet: cc.quantityLimitPerWallet,
        pricePerToken: cc.pricePerToken,
      };
      if (cc.merkleRoot !== padHex("0x", { size: 32 })) {
        const claimerProof = await fetchProofsForClaimer({
          contract: options.contract,
          claimer: options.from || options.to, // receiver and claimer can be different, always prioritize the claimer for allowlists
          merkleRoot: cc.merkleRoot,
        });
        if (claimerProof) {
          proofData = claimerProof;
        }
      }
      return [
        options.to, //receiver
        options.tokenId, //tokenId
        options.quantity, //quantity
        cc.currency, //currency
        cc.pricePerToken, //pricePerToken
        // proof
        proofData,
        // end proof
        "0x", //data
      ] as const;
    },
    value: async () => {
      // TODO this should not be refetched
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      if (isNativeTokenAddress(cc.currency)) {
        return cc.pricePerToken * BigInt(options.quantity);
      }
      return 0n;
    },
  });
}
