import type { Address } from "abitype";
import {
  prepareContractCall,
  type TxOpts,
} from "../../../transaction/transaction.js";

const CLAIM_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "receiver",
      type: "address",
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
  quantity: bigint;
  // TODO: needed for non-claim conditon claims?
  // pricePerToken?: bigint;
  currencyAddress?: Address;
  checkERC20Allowance?: boolean;
};

/**
 * @internal
 */
// TODO: finish implementing this
export function claimTo(options: TxOpts<ClaimToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: CLAIM_ABI,
    params: async () => {
      // TODO: fill this in
      return [
        "", //receiver
        0n, //quantity
        "", //currency
        0n, //pricePerToken
        // proof
        {
          currency: "",
          proof: [],
          quantityLimitPerWallet: 0n,
          pricePerToken: 0n,
        },
        // end proof
        "0x", //data
      ] as const;
    },
  });
}

/**
 * @internal
 */
// TODO: implement this
export function parseClaimToLogs() {
  throw new Error("Not implemented");
}
