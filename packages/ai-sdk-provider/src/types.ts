import type { UIDataTypes, UIMessage } from "ai";
import type {
  MonitorTransactionInput,
  MonitorTransactionOutput,
  SignSwapInput,
  SignTransactionInput,
  TransactionOutput,
} from "./tools.js";

export const DEFAULT_BASE_URL = "https://api.thirdweb.com";

export interface ThirdwebConfig {
  /**
   * Optional: The base URL of the thirdweb API, defaults to https://api.thirdweb.com
   */
  baseURL?: string;
  /**
   * Your project secret key for backend usage - get it from the thirdweb dashboard
   */
  secretKey?: string;
  /**
   * Your project client ID - get it from the thirdweb dashboard
   */
  clientId?: string;
  /**
   * Optional: The user wallet auth token (JWT) for executing transactions
   */
  walletAuthToken?: string;
}

export interface ThirdwebSettings {
  context?: {
    /**
     * Optional: Whether to automatically execute transactions. Defaults to false.
     */
    auto_execute_transactions?: boolean;
    /**
     * Optional: The chain IDs to default to for queries and transactions.
     */
    chain_ids?: number[];
    /**
     * Optional: The from address to execute transactions from
     */
    from?: string;
    /**
     * Optional: The session ID to use for continuing the conversation
     */
    session_id?: string | null;
  };
}

export type ThirdwebAiMessage = UIMessage<
  {
    session_id: string;
  },
  UIDataTypes,
  {
    sign_transaction: {
      input: SignTransactionInput;
      output: TransactionOutput;
    };
    sign_swap: {
      input: SignSwapInput;
      output: TransactionOutput;
    };
    monitor_transaction: {
      input: MonitorTransactionInput;
      output: MonitorTransactionOutput;
    };
  }
>;
