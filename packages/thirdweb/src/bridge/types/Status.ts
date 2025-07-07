import type { Address as ox__Address, Hex as ox__Hex } from "ox";
import type { PurchaseData } from "../../pay/types.js";
import type { Token } from "./Token.js";
export type Status =
  | {
      status: "COMPLETED";
      paymentId: string;
      originAmount: bigint;
      destinationAmount: bigint;
      originChainId: number;
      destinationChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationTokenAddress: ox__Address.Address;
      originToken: Token;
      destinationToken: Token;
      sender: ox__Address.Address;
      receiver: ox__Address.Address;
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
      purchaseData?: PurchaseData;
    }
  | {
      status: "PENDING";
      paymentId: string;
      originAmount: bigint;
      originChainId: number;
      destinationChainId: number;
      originTokenAddress: ox__Address.Address;
      destinationTokenAddress: ox__Address.Address;
      originToken: Token;
      destinationToken: Token;
      sender: ox__Address.Address;
      receiver: ox__Address.Address;
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
      purchaseData?: PurchaseData;
    }
  | {
      status: "FAILED";
      paymentId: string;
      transactions: Array<{
        chainId: number;
        transactionHash: ox__Hex.Hex;
      }>;
      purchaseData?: PurchaseData;
    }
  | {
      status: "NOT_FOUND";
      paymentId: string;
      transactions: [];
    };
