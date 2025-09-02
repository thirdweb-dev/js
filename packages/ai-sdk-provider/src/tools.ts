import type { Tool } from "ai";
import { z } from "zod/v4";
import type { ThirdwebConfig } from "./types.js";

const AgentActionSignTransactionData = z.object({
  chain_id: z.number(),
  function: z.string().nullable().optional(),
  to: z.string(),
  value: z.string(),
  data: z.string(),
});

const AgentActionSignSwapDataIntent = z.object({
  origin_chain_id: z.number(),
  origin_token_address: z.string(),
  destination_chain_id: z.number(),
  destination_token_address: z.string(),
  amount: z.string(),
  sender: z.string(),
  receiver: z.string(),
  max_steps: z.number(),
});

const AgentActionSignSwapData = z.object({
  action: z.string(),
  intent: AgentActionSignSwapDataIntent,
  transaction: AgentActionSignTransactionData,
});

const AgentActionTransactionOutputData = z.object({
  transaction_hash: z.string(),
  chain_id: z.number(),
});
export type TransactionOutput = z.infer<
  typeof AgentActionTransactionOutputData
>;

const AgentActionMonitorTransactionData = z.object({
  transaction_id: z.string(),
});

const AgentActionMonitorTransactionOutputData = z.object({
  status: z.enum(["QUEUED", "SUBMITTED", "CONFIRMED", "FAILED"]),
  transaction_hash: z.string().optional(),
  chain_id: z.number(),
});
export type MonitorTransactionOutput = z.infer<
  typeof AgentActionMonitorTransactionOutputData
>;

export type SignTransactionInput = z.infer<
  typeof AgentActionSignTransactionData
>;
export type SignSwapInput = z.infer<typeof AgentActionSignSwapData>;
export type MonitorTransactionInput = z.infer<
  typeof AgentActionMonitorTransactionData
>;

export function createTools(_config: ThirdwebConfig) {
  return {
    sign_transaction: {
      id: "thirdweb.sign_transaction" as const,
      name: "sign_transaction",
      description: "Sign a transaction",
      inputSchema: AgentActionSignTransactionData,
      outputSchema: AgentActionTransactionOutputData,
    } satisfies Tool<SignTransactionInput, TransactionOutput>,
    sign_swap: {
      id: "thirdweb.sign_swap" as const,
      name: "sign_swap",
      description: "Sign a swap transaction",
      inputSchema: AgentActionSignSwapData,
      outputSchema: AgentActionTransactionOutputData,
    } satisfies Tool<SignSwapInput, TransactionOutput>,
    monitor_transaction: {
      id: "thirdweb.monitor_transaction" as const,
      name: "monitor_transaction",
      description: "Monitor a transaction",
      inputSchema: AgentActionMonitorTransactionData,
      outputSchema: AgentActionMonitorTransactionOutputData,
    } satisfies Tool<MonitorTransactionInput, MonitorTransactionOutput>,
  } as const;
}
