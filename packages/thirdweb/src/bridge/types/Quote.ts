import type { TransactionEnvelopeEip1559 as ox__TransactionEnvelopeEip1559 } from "ox";

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
};

export type PreparedQuote = Quote & {
  /**
   * The expiration timestamp for the quote. All transactions must be executed before this timestamp to guarantee successful execution at the specified price.
   */
  expiration?: number | undefined;
  /**
   * A series of [ox](https://oxlib.sh) EIP-1559 transactions that must be executed in sequential order to fulfill the complete route.
   */
  transactions: Array<
    ox__TransactionEnvelopeEip1559.TransactionEnvelopeEip1559<
      false,
      bigint,
      number,
      "eip1559"
    >
  >;
};
