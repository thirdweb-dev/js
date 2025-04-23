import type { Hex as ox__Hex } from "ox";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";

export type Quote = {
  /**
   * The input amount (in wei) including fees to be paid.
   */
  originAmount: bigint;
  /**
   * The output amount (in wei) to be received.
   */
  destinationAmount: bigint;
  /**
   * The blocknumber this quote was generated at.
   */
  blockNumber?: bigint;
  /**
   * The timestamp this quote was generated at.
   */
  timestamp: number;
  /**
   * The estimated execution time in milliseconds.
   */
  estimatedExecutionTimeMs?: number | undefined;
  /**
   * The steps required to complete the quote.
   */
  steps: Array<{
    originToken: {
      chainId: number;
      address: ox__Hex.Hex;
      symbol: string;
      name: string;
      decimals: number;
      priceUsd: number;
      iconUri: string;
    };
    destinationToken: {
      chainId: number;
      address: ox__Hex.Hex;
      symbol: string;
      name: string;
      decimals: number;
      priceUsd: number;
      iconUri: string;
    };
    originAmount: bigint;
    destinationAmount: bigint;
    estimatedExecutionTimeMs: number;
  }>;
};

export type PreparedQuote = {
  /**
   * The input amount (in wei) including fees to be paid.
   */
  originAmount: bigint;
  /**
   * The output amount (in wei) to be received.
   */
  destinationAmount: bigint;
  /**
   * The blocknumber this quote was generated at.
   */
  blockNumber?: bigint;
  /**
   * The timestamp this quote was generated at.
   */
  timestamp: number;
  /**
   * The estimated execution time in milliseconds.
   */
  estimatedExecutionTimeMs?: number | undefined;
  /**
   * The expiration timestamp for the quote. All transactions must be executed before this timestamp to guarantee successful execution at the specified price.
   */
  expiration?: number | undefined;
  /**
   * A series of steps required to complete the quote, along with the transactions to execute in order.
   */
  steps: Array<{
    originToken: {
      chainId: number;
      address: ox__Hex.Hex;
      symbol: string;
      name: string;
      decimals: number;
      priceUsd: number;
      iconUri: string;
    };
    destinationToken: {
      chainId: number;
      address: ox__Hex.Hex;
      symbol: string;
      name: string;
      decimals: number;
      priceUsd: number;
      iconUri: string;
    };
    originAmount: bigint;
    destinationAmount: bigint;
    estimatedExecutionTimeMs: number;
    transactions: Array<{
      data: ox__Hex.Hex;
      to: ox__Hex.Hex;
      value?: bigint | undefined;
      chainId: number;
      /**
       * The action this transaction performs. This can be "approval", "transfer", "buy", or "sell".
       */
      action: "approval" | "transfer" | "buy" | "sell";
      /**
       * The transaction ID, used for tracking purposes.
       */
      id: ox__Hex.Hex;
      client: ThirdwebClient;
      chain: Chain;
    }>;
  }>;
};
