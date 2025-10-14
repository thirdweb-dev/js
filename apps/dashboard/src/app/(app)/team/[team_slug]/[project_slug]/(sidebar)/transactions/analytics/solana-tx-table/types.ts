export type SolanaTransactionStatus =
  | "queued"
  | "processing"
  | "sent"
  | "confirmed"
  | "failed"
  | "cancelled";

export type SolanaTransaction = {
  transactionId: string;
  chainId: string;
  signerAddress: string;
  status: SolanaTransactionStatus;
  signature?: string;
  queuedAt: string;
  sentAt?: string;
  confirmedAt?: string;
  errorMessage?: string;
};

export type SolanaTransactionsResponse = {
  transactions: SolanaTransaction[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
};
