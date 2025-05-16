import type { Address, Hex } from "thirdweb";

// Revert data type (referenced but not defined in the provided code)
type RevertDataSerialized = {
  revertReason?: string;
  decodedError?: {
    name: string;
    signature: string;
    args: string[];
  };
};

// Transaction parameters
type TransactionParamsSerialized = {
  to: Address;
  data: Hex;
  value: string;
};

// Execution parameters
type ExecutionParams4337Serialized = {
  type: "AA";
  entrypointAddress: string;
  smartAccountAddress: string;
  signerAddress: string;
};

type ExecutionParamsSerialized = ExecutionParams4337Serialized;

// Execution result
type ExecutionResult4337Serialized =
  | {
      status: "QUEUED";
    }
  | {
      status: "FAILED";
      error: string;
    }
  | {
      status: "SUBMITTED";
      monitoringStatus: "WILL_MONITOR" | "CANNOT_MONITOR";
      userOpHash: string;
    }
  | ({
      status: "CONFIRMED";
      userOpHash: Hex;
      transactionHash: Hex;
      actualGasCost: string;
      actualGasUsed: string;
      nonce: string;
    } & (
      | {
          onchainStatus: "SUCCESS";
        }
      | {
          onchainStatus: "REVERTED";
          revertData?: RevertDataSerialized;
        }
    ));

type ExecutionResultSerialized = ExecutionResult4337Serialized;

// Main Transaction type from database
export type Transaction = {
  id: string;
  batchIndex: number;
  chainId: string;
  from: Address | null;
  transactionParams: TransactionParamsSerialized[];
  transactionHash: Hex | null;
  confirmedAt: Date | null;
  confirmedAtBlockNumber: string | null;
  enrichedData: unknown[];
  executionParams: ExecutionParamsSerialized;
  executionResult: ExecutionResultSerialized | null;
  createdAt: Date;
  errorMessage: string | null;
  cancelledAt: Date | null;
};

export type TransactionStatus =
  | "QUEUED"
  | "SUBMITTED"
  | "CONFIRMED"
  | "REVERTED"
  | "FAILED";

type Pagination = {
  totalCount: number;
  page: number;
  limit: number;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  pagination: Pagination;
};
