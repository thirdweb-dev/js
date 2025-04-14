export type EngineTxStatus = {
  queueId: string;
  status: "queued" | "sent" | "mined" | "errored" | "cancelled";
  chainId: string | null;
  transactionHash: string | null;
  queuedAt: string | null;
  sentAt: string | null;
  minedAt: string | null;
  cancelledAt: string | null;
};
