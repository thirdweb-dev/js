/**
 * Represents a blockchain chain in the Universal Bridge.
 * @public
 */
export interface Chain {
  /**
   * The chain ID of the chain.
   */
  chainId: number;

  /**
   * The name of the chain.
   */
  name: string;

  /**
   * The URL of the chain's icon.
   */
  icon: string;

  /**
   * Information about the native currency of the chain.
   */
  nativeCurrency: {
    /**
     * The name of the native currency.
     */
    name: string;

    /**
     * The symbol of the native currency.
     */
    symbol: string;

    /**
     * The number of decimals used by the native currency.
     */
    decimals: number;
  };
}
