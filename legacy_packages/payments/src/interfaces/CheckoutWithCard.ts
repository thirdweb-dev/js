// UNCHANGED

export interface ReviewResult {
  /**
   * A unique ID for this purchase.
   */
  id: string;

  /**
   * The cardholder's full name provided by the buyer.
   */
  cardholderName: string;
}

export interface KycModal {
  iframeLink: string;
}

/**
 * The ICheckoutWithCardConfigs interface defines the configuration options for the checkoutWithCard component provided by Paper.
 * This component allows users to generate a card payment component for NFTs without needing any backend calls.
 *
 * The configuration options include:
 *
 * - `contractId`: The id of your contract (not the address) found in you seller dashboard.
 * - `walletAddress`: The wallet address to which the payment will be sent (AKA the receiving wallet).
 * - `email`: (Optional) Email address of the buyer.
 * - `quantity`: (Optional) The number of items to be purchased.
 * - `metadata`: (Optional) A record of additional information about the transaction.
 * - `mintMethod`: (Optional, Only required for Custom Contract Types) The contract function name, function args, and payment information which will be sent to your contract.
 * - `contractArgs`: (Optional) Depending on the contract type, this can defined additional args to call your contract with. See [Thirdweb/Reservoir docs](https://docs.withpaper.com/reference/thirdweb-contracts) for more details.
 * - `feeBearer`: (Optional) Who will bear the transaction fee, either 'BUYER' or 'SELLER'.
 * - `capturePaymentLater`: (Optional) If set to true, the payment is authorized but not captured immediately.
 * - `fiatCurrency`: (Optional) The type of fiat currency for the payment.
 * - `title`: (Optional) The title to be displayed on the Stripe receipt.
 * - `sendEmailOnTransferSucceeded`: (Optional) If set to true, an email is sent when the transfer succeeds.
 * - `postPurchaseMessageMarkdown`: (Optional) A post-purchase message in Markdown format.
 * - `postPurchaseButtonText`: (Optional) The text for the post-purchase button.
 * - `successCallbackUrl`: (Optional) The URL to be called back when the transaction is successful.
 *
 * Note: This interface is part of an open-source npm package. Please ensure you understand the implications of each field before using this interface.
 */
export interface ICheckoutWithCardConfigs {
  contractId: string;
  walletAddress: string;
  email?: string;
  quantity?: number;
  mintMethod?: {
    name: string;
    args: Record<string, any>;
    payment: { value: string; currency: string };
  };
  contractArgs?: Record<string, any>;

  // payment customizations
  capturePaymentLater?: boolean;
  fiatCurrency?: string;

  // stripe receipt
  title?: string;

  // email
  sendEmailOnTransferSucceeded?: boolean;
  postPurchaseMessageMarkdown?: string;
  postPurchaseButtonText?: string;
  successCallbackUrl?: string;
}
