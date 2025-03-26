import type { Address as ox__Address, Hex as ox__Hex } from "ox";

export type Status =
  | {
      status: "COMPLETED";
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
      status: "PENDING";
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
      status: "FAILED";
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
    }
  | {
      status: "NOT_FOUND";
      transactions: [];
    };
