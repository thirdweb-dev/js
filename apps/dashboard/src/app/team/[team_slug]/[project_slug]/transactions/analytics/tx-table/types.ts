import type { Address, Hex } from "thirdweb";

// Revert data type (referenced but not defined in the provided code)
export type RevertDataSerialized = {
  revertReason?: string;
  decodedError?: {
    name: string;
    signature: string;
    args: string[];
  };
};

// Transaction parameters
export type TransactionParamsSerialized = {
  to: Address;
  data: Hex;
  value: string;
};

// Execution parameters
export type ExecutionParams4337Serialized = {
  type: "AA";
  entrypointAddress: string;
  smartAccountAddress: string;
  signerAddress: string;
};

export type ExecutionParamsSerialized = ExecutionParams4337Serialized;

// Execution result
export type ExecutionResult4337Serialized =
  | {
      status: "QUEUED";
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

export type ExecutionResultSerialized = ExecutionResult4337Serialized;

// Enriched data type (not fully defined in the provided code)
export type EnrichedDataItem = {
  type: string;
  // data: any;
};

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
  // enrichedData: EnrichedDataItem[];
  executionParams: ExecutionParamsSerialized;
  executionResult: ExecutionResultSerialized | null;
  createdAt: Date;
  errorMessage: string | null;
  cancelledAt: Date | null;
};

export type TransactionStatus = ExecutionResultSerialized["status"];

export type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    limit: number;
    page: number;
    totalCount: number;
  };
};
