import type { Money, PaymentMiddlewareConfig } from "x402/types";
import type z from "zod";
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

export const x402Version = 1;

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
  /** The payment data/proof provided by the client, typically from the X-PAYMENT header */
  paymentData?: string | null;
  /** The blockchain network where the payment should be processed */
  network: FacilitatorNetwork | Chain;
  /** The price for accessing the resource - either a USD amount (e.g., "$0.10") or a specific token amount */
  price: Money | ERC20TokenAmount;
  /** The payment facilitator instance used to verify and settle payments */
  facilitator: ThirdwebX402Facilitator;
  /** Optional configuration for the payment middleware route */
  routeConfig?: PaymentMiddlewareConfig;
  /** Optional recipient address to receive the payment if different from your facilitator address */
  payTo?: string;
};

export type SettlePaymentArgs = PaymentArgs & {
  waitUntil?: WaitUntil;
};

export type PaymentRequiredResult = {
  /** HTTP 402 - Payment Required, verification or processing failed or payment missing */
  status: 402;
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
  };
  /** Response headers for the error response */
  responseHeaders: Record<string, string>;
};

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
      decodedPayment: RequestedPaymentPayload;
      selectedPaymentRequirements: RequestedPaymentRequirements;
    }
  | PaymentRequiredResult
>;

export type SupportedSignatureType = z.infer<
  typeof SupportedSignatureTypeSchema
>;

export type ERC20TokenAmount = {
  amount: string;
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
