import type { Address as ox__Address, Hex as ox__Hex } from "ox";

export type Status =
  | {
      status: "completed";
      originAmount: bigint;
      destinationAmount: bigint;
      originChainId: number;
      destinationChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationTokenAddress: ox__Address.Address;
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
    }
  | {
      status: "pending";
      originAmount: bigint;
      originChainId: number;
      destinationChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationTokenAddress: ox__Address.Address;
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
    }
  | {
      status: "failed";
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
    };