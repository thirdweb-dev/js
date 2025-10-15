export type SolanaTransactionStatus =
  | "QUEUED"
  | "SUBMITTED"
  | "CONFIRMED"
  | "FAILED";

type SolanaTransactionParamsSerialized = {
  instructions: Array<{
    programId: string;
    keys: Array<{
      pubkey: string;
      isSigner: boolean;
      isWritable: boolean;
    }>;
    data: string;
  }>;
};

type SolanaExecutionParamsSerialized = {
  type: "SOLANA";
  signerAddress: string;
  chainId: string;
  commitment?: "processed" | "confirmed" | "finalized";
  computeUnitLimit?: number;
  computeUnitPrice?: number;
  skipPreflight?: boolean;
};

type SolanaExecutorError = {
  errorCode?: string;
  message?: string;
  innerError?: unknown;
  reason?: string;
  [key: string]: unknown;
};

type SolanaTransactionMeta = {
  err?: unknown | null;
  status?: {
    Ok?: unknown | null;
  };
  fee: number;
  preBalances: number[];
  postBalances: number[];
  innerInstructions: unknown[];
  logMessages: string[];
  preTokenBalances: unknown[];
  postTokenBalances: unknown[];
  rewards: unknown[];
  loadedAddresses: {
    writable: string[];
    readonly: string[];
  };
  computeUnitsConsumed?: number;
  costUnits?: number;
};

type SolanaTransactionDetails = {
  transaction: {
    signatures: string[];
    message: {
      header: {
        numRequiredSignatures: number;
        numReadonlySignedAccounts: number;
        numReadonlyUnsignedAccounts: number;
      };
      accountKeys: string[];
      recentBlockhash: string;
      instructions: Array<{
        programIdIndex: number;
        accounts: number[];
        data: string;
        stackHeight?: number;
      }>;
      addressTableLookups: unknown[];
    };
  };
  meta: SolanaTransactionMeta;
  version: number | "legacy";
};

type SolanaExecutionResultSerialized =
  | {
      status: "QUEUED";
    }
  | {
      status: "FAILED";
      error: SolanaExecutorError;
    }
  | {
      status: "SUBMITTED";
      monitoringStatus: "WILL_MONITOR" | "CANNOT_MONITOR";
      signature: string;
      submissionAttemptNumber: number;
    }
  | ({
      status: "CONFIRMED";
      signature: string;
      signerAddress: string;
      chainId: string;
      submissionAttemptNumber: number;
      slot: number;
      blockTime: number | null;
      transaction: SolanaTransactionDetails;
    } & (
      | {
          onchainStatus: "SUCCESS";
        }
      | {
          onchainStatus: "REVERTED";
          error?: string;
        }
    ));

export type SolanaTransaction = {
  id: string;
  clientId: string;
  chainId: string;
  signerAddress: string;
  transactionParams: SolanaTransactionParamsSerialized;
  signature: string | null;
  status: SolanaTransactionStatus | null;
  confirmedAt: Date | null;
  confirmedAtSlot: string | null;
  blockTime: number | null;
  enrichedData: unknown[];
  executionParams: SolanaExecutionParamsSerialized;
  executionResult: SolanaExecutionResultSerialized | null;
  createdAt: Date;
  errorMessage: string | null;
  cancelledAt: Date | null;
};

export type SolanaTransactionsResponse = {
  transactions: SolanaTransaction[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
};
