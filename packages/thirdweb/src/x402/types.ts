import type { Money, PaymentMiddlewareConfig } from "x402/types";
import z from "zod";
import type { Chain } from "../chains/types.js";
import type { Prettify } from "../utils/type-utils.js";
import type { ThirdwebX402Facilitator, WaitUntil } from "./facilitator.js";
import type {
  FacilitatorNetwork,
  FacilitatorSettleResponse,
  RequestedPaymentPayload,
  RequestedPaymentRequirements,
  SupportedSignatureTypeSchema,
} from "./schemas.js";

const supportedX402Versions = [1, 2] as const;
export type X402Version = (typeof supportedX402Versions)[number];
export const x402Version: X402Version = 2;

/**
 * Configuration object for verifying or processing X402 payments.
 *
 * @public
 */
export type PaymentArgs = {
  /** The URL of the resource being protected by the payment */
  resourceUrl: string;
  /** The HTTP method used to access the resource */
  method: "GET" | "POST" | ({} & string);
  /**
   * The payment data/proof provided by the client, typically from the PAYMENT-SIGNATURE (v2) or X-PAYMENT (v1) header
   */
  paymentData?: string | null;
  /** The blockchain network where the payment should be processed */
  network: FacilitatorNetwork | Chain;
  /** The price for accessing the resource - either a USD amount (e.g., "$0.10") or a specific token amount */
  price: Money | ERC20TokenAmount;
  /** The minimum price for accessing the resource - Only applicable for the "upto" payment scheme */
  minPrice?: Money | ERC20TokenAmount;
  /** The payment facilitator instance used to verify and settle payments */
  facilitator: ThirdwebX402Facilitator;
  /** The scheme of the payment, either "exact" or "upto", defaults to "exact" */
  scheme?: PaymentScheme;
  /** Optional configuration for the payment middleware route */
  routeConfig?: PaymentMiddlewareConfig;
  /** Optional recipient address to receive the payment if different from your facilitator address */
  payTo?: string;
  /** Optional extra data to be included in the payment request */
  extraMetadata?: Record<string, unknown>;
  /** The x402 protocol version to use, defaults to v2 */
  x402Version?: X402Version;
};

export type SettlePaymentArgs = PaymentArgs & {
  waitUntil?: WaitUntil;
};

/**
 * Payment required result for x402 v1 (body-based format)
 */
export type PaymentRequiredResultV1 = {
  /** HTTP 402 - Payment Required, verification or processing failed or payment missing */
  status: 402;
  /** Response headers for the error response */
  responseHeaders: Record<string, string>;
  /** The error response body containing payment requirements */
  responseBody: {
    /** The X402 protocol version */
    x402Version: number;
    /** error code */
    error: string;
    /** Human-readable error message */
    errorMessage?: string;
    /** Array of acceptable payment methods and requirements */
    accepts: RequestedPaymentRequirements[];
    /** Optional payer address if verification partially succeeded */
    payer?: string;
    /** Optional link to a wallet to fund the wallet of the payer */
    fundWalletLink?: string;
  };
};

/**
 * Payment required result for x402 v2 (header-based format)
 */
export type PaymentRequiredResultV2 = {
  /** HTTP 402 - Payment Required, verification or processing failed or payment missing */
  status: 402;
  /** Response headers containing base64 encoded payment requirements */
  responseHeaders: Record<string, string>;
  /** Empty response body for v2 */
  responseBody: Record<string, never>;
};

/**
 * Payment required result supporting both v1 and v2 formats
 */
export type PaymentRequiredResult =
  | PaymentRequiredResultV1
  | PaymentRequiredResultV2;

/**
 * The result of a payment settlement operation.
 *
 * @public
 */
export type SettlePaymentResult = Prettify<
  | {
      /** HTTP 200 - Payment was successfully processed */
      status: 200;
      /** Response headers including payment receipt information */
      responseHeaders: Record<string, string>;
      /** The payment receipt from the payment facilitator */
      paymentReceipt: FacilitatorSettleResponse;
    }
  | PaymentRequiredResult
>;

/**
 * The result of a payment verification operation.
 *
 * @public
 */
export type VerifyPaymentResult = Prettify<
  | {
      /** HTTP 200 - Payment was successfully verified */
      status: 200;
      /** The decoded payment payload */
      decodedPayment: RequestedPaymentPayload;
      /** The selected payment requirements */
      selectedPaymentRequirements: RequestedPaymentRequirements;
      /** The current remaining allowance of the payment of the selected payment asset, only applicable for the "upto" payment scheme */
      allowance?: string;
      /** The current balance of the user's wallet in the selected payment asset */
      balance?: string;
      /** The payer address if verification succeeded */
      payer?: string;
    }
  | PaymentRequiredResult
>;

export type SupportedSignatureType = z.infer<
  typeof SupportedSignatureTypeSchema
>;

export const PaymentSchemeSchema = z.union([
  z.literal("exact"),
  z.literal("upto"),
]);
type PaymentScheme = z.infer<typeof PaymentSchemeSchema>;

/**
 * The asset, scheme and amount for the payment in base units
 */
export type ERC20TokenAmount = {
  /** The amount of the payment in base units */
  amount: string;
  /** The asset of the payment, decimals and eip712 data are optional and will be inferred from the address if not provided */
  asset: {
    address: `0x${string}`;
    decimals?: number;
    eip712?: {
      name: string;
      version: string;
      primaryType: SupportedSignatureType;
    };
  };
};
