export interface PriceSummary {
  quantity: number;
  unitPrice: PriceDetail;
  networkFees: PriceDetail;
  serviceFees: PriceDetail;
  total: PriceDetail;
  cryptoToFiatConversionRate?: number;
}

export interface PriceDetail {
  /**
   * A human-readable string to display.
   * Example: $123.45 CAD
   */
  display: string;
  /**
   * This is the value in smallest units (cents, yen, wei).
   * Example: 12345
   */
  valueInSubunits: number;
  /**
   * The currency associated with the value.
   * Example: USD, ETH
   */
  currency: string;
}
