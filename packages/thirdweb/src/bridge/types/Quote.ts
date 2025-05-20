import type { RouteQuoteStep, RouteStep } from "./Route.js";

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
  steps: RouteQuoteStep[];
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
  steps: RouteStep[];
};
