import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";

const ABI = {
  inputs: [],
  name: "claimCondition",
  outputs: [
    {
      components: [
        {
          internalType: "uint256",
          name: "startTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxClaimableSupply",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "supplyClaimed",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantityLimitPerWallet",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "merkleRoot",
          type: "bytes32",
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
        {
          internalType: "string",
          name: "metadata",
          type: "string",
        },
      ],
      internalType: "struct IClaimCondition.ClaimCondition",
      name: "condition",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

/**
 *
 * @internal
 */
export async function claimCondition(options: TxOpts) {
  return readContract({
    ...options,
    method: ABI,
  });
}
