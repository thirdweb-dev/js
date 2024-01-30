import type { Hex } from "viem";

export type TransactionOrUserOpHash =
  | {
      readonly transactionHash: Hex;
      readonly userOpHash?: never;
    }
  | {
      readonly transactionHash?: never;
      readonly userOpHash: Hex;
    };
