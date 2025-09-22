import {
  type ERC20TokenAmount,
  type Money,
  moneySchema,
  type Network,
  type PaymentMiddlewareConfig,
  SupportedEVMNetworks,
} from "x402/types";
import { type Address, getAddress } from "../utils/address.js";
import { stringify } from "../utils/json.js";
import { decodePayment, safeBase64Encode } from "./encode.js";
import type { facilitator as facilitatorType } from "./facilitator.js";
import {
  type FacilitatorNetwork,
  type FacilitatorSettleResponse,
  networkToChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
} from "./schemas.js";

const x402Version = 1;

/**
 * Configuration object for verifying X402 payments.
 *
 * @public
 */
export type VerifyPaymentArgs = {
  /** The URL of the resource being protected by the payment */
  resourceUrl: string;
  /** The HTTP method used to access the resource */
  method: "GET" | "POST" | ({} & string);
  /** The payment data/proof provided by the client, typically from the X-PAYMENT header */
  paymentData?: string | null;
  /** The wallet address that should receive the payment */
  payTo: Address;
  /** The blockchain network where the payment should be processed */
  network: FacilitatorNetwork;
  /** The price for accessing the resource - either a USD amount (e.g., "$0.10") or a specific token amount */
  price: Money | ERC20TokenAmount;
  /** The payment facilitator instance used to verify and settle payments */
  facilitator: ReturnType<typeof facilitatorType>;
  /** Optional configuration for the payment middleware route */
  routeConfig?: PaymentMiddlewareConfig;
};

/**
 * The result of a payment verification operation.
 *
 * @public
 */
export type VerifyPaymentResult =
  | {
      /** HTTP 200 - Payment was successfully verified and settled */
      status: 200;
      /** Response headers including payment receipt information */
      responseHeaders: Record<string, string>;
      /** The settlement receipt from the payment facilitator */
      paymentReceipt: FacilitatorSettleResponse;
    }
  | {
      /** HTTP 402 - Payment Required, verification failed or payment missing */
      status: 402;
      /** The error response body containing payment requirements */
      responseBody: {
        /** The X402 protocol version */
        x402Version: number;
        /** Human-readable error message */
        error: string;
        /** Array of acceptable payment methods and requirements */
        accepts: RequestedPaymentRequirements[];
        /** Optional payer address if verification partially succeeded */
        payer?: string;
      };
      /** Response headers for the error response */
      responseHeaders: Record<string, string>;
    };

/**
 * Verifies and processes X402 payments for protected resources.
 *
 * This function implements the X402 payment protocol, verifying payment proofs
 * and settling payments through a facilitator service. It handles the complete
 * payment flow from validation to settlement.
 *
 * @param args - Configuration object containing payment verification parameters
 * @returns A promise that resolves to either a successful payment result (200) or payment required error (402)
 *
 * @example
 * ```ts
 * // Usage in a Next.js API route
 * import { verifyPayment, facilitator } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 *
 * const client = createThirdwebClient({
 *   secretKey: process.env.THIRDWEB_SECRET_KEY,
 * });
 *
 * const thirdwebFacilitator = facilitator({
 *   client,
 *   serverWalletAddress: "0x1234567890123456789012345678901234567890",
 * });
 *
 * export async function GET(request: Request) {
 *   const paymentData = request.headers.get("x-payment");
 *
 *   const result = await verifyPayment({
 *     resourceUrl: "https://api.example.com/premium-content",
 *     method: "GET",
 *     paymentData,
 *     payTo: "0x1234567890123456789012345678901234567890",
 *     network: "eip155:84532", // CAIP2 format: "eip155:<chain_id>"
 *     price: "$0.10", // or { amount: "100000", asset: { address: "0x...", decimals: 6 } }
 *     facilitator: thirdwebFacilitator,
 *     routeConfig: {
 *       description: "Access to premium API content",
 *       mimeType: "application/json",
 *       maxTimeoutSeconds: 300,
 *     },
 *   });
 *
 *   if (result.status === 200) {
 *     // Payment verified and settled successfully
 *     return Response.json({ data: "premium content" }, {
 *       headers: result.responseHeaders,
 *     });
 *   } else {
 *     // Payment required
 *     return Response.json(result.responseBody, {
 *       status: result.status,
 *       headers: result.responseHeaders,
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Usage in Express middleware
 * import express from "express";
 * import { verifyPayment, facilitator } from "thirdweb/x402";
 *
 * const app = express();
 *
 * async function paymentMiddleware(req, res, next) {
 *   const result = await verifyPayment({
 *     resourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
 *     method: req.method,
 *     paymentData: req.headers["x-payment"],
 *     payTo: "0x1234567890123456789012345678901234567890",
 *     network: "eip155:8453", // CAIP2 format: "eip155:<chain_id>"
 *     price: "$0.05",
 *     facilitator: thirdwebFacilitator,
 *   });
 *
 *   if (result.status === 200) {
 *     // Set payment receipt headers and continue
 *     Object.entries(result.responseHeaders).forEach(([key, value]) => {
 *       res.setHeader(key, value);
 *     });
 *     next();
 *   } else {
 *     // Return payment required response
 *     res.status(result.status)
 *        .set(result.responseHeaders)
 *        .json(result.responseBody);
 *   }
 * }
 *
 * app.get("/api/premium", paymentMiddleware, (req, res) => {
 *   res.json({ message: "This is premium content!" });
 * });
 * ```
 *
 * @public
 * @beta
 * @bridge x402
 */
export async function verifyPayment(
  args: VerifyPaymentArgs,
): Promise<VerifyPaymentResult> {
  const {
    price,
    network,
    routeConfig = {},
    resourceUrl,
    method,
    payTo,
    paymentData: paymentProof,
    facilitator,
  } = args;
  const {
    description,
    mimeType,
    maxTimeoutSeconds,
    inputSchema,
    outputSchema,
    errorMessages,
    discoverable,
  } = routeConfig;

  const atomicAmountForAsset = await processPriceToAtomicAmount(
    price,
    network,
    facilitator,
  );
  if ("error" in atomicAmountForAsset) {
    return {
      status: 402,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        x402Version,
        error: atomicAmountForAsset.error,
        accepts: [],
      },
    };
  }
  const { maxAmountRequired, asset } = atomicAmountForAsset;

  const paymentRequirements: RequestedPaymentRequirements[] = [];

  if (
    SupportedEVMNetworks.includes(network as Network) ||
    network.startsWith("eip155:")
  ) {
    paymentRequirements.push({
      scheme: "exact",
      network,
      maxAmountRequired,
      resource: resourceUrl,
      description: description ?? "",
      mimeType: mimeType ?? "application/json",
      payTo: getAddress(payTo),
      maxTimeoutSeconds: maxTimeoutSeconds ?? 300,
      asset: getAddress(asset.address),
      // TODO: Rename outputSchema to requestStructure
      outputSchema: {
        input: {
          type: "http",
          method,
          discoverable: discoverable ?? true,
          ...inputSchema,
        },
        output: outputSchema,
      },
      extra: (asset as ERC20TokenAmount["asset"]).eip712,
    });
  } else {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error: `Unsupported network: ${network}`,
        accepts: paymentRequirements,
      },
    };
  }

  // Check for payment header
  if (!paymentProof) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error: errorMessages?.paymentRequired || "X-PAYMENT header is required",
        accepts: paymentRequirements,
      },
    };
  }

  // Verify payment
  let decodedPayment: RequestedPaymentPayload;
  try {
    decodedPayment = decodePayment(paymentProof);
    decodedPayment.x402Version = x402Version;
  } catch (error) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.invalidPayment ||
          (error instanceof Error ? error.message : "Invalid payment"),
        accepts: paymentRequirements,
      },
    };
  }

  const selectedPaymentRequirements = paymentRequirements.find(
    (value) =>
      value.scheme === decodedPayment.scheme &&
      value.network === decodedPayment.network,
  );
  if (!selectedPaymentRequirements) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.noMatchingRequirements ||
          "Unable to find matching payment requirements",
        accepts: paymentRequirements,
      },
    };
  }

  try {
    const verification = await facilitator.verify(
      decodedPayment,
      selectedPaymentRequirements,
    );

    if (!verification.isValid) {
      return {
        status: 402,
        responseHeaders: {
          "Content-Type": "application/json",
        },
        responseBody: {
          x402Version,
          error:
            errorMessages?.verificationFailed ||
            verification.invalidReason ||
            "Payment verification failed",
          accepts: paymentRequirements,
          payer: verification.payer,
        },
      };
    }
  } catch (error) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.verificationFailed ||
          (error instanceof Error
            ? error.message
            : "Payment Verification error"),
        accepts: paymentRequirements,
      },
    };
  }

  // Settle payment
  try {
    const settlement = await facilitator.settle(
      decodedPayment,
      selectedPaymentRequirements,
    );

    if (settlement.success) {
      return {
        status: 200,
        paymentReceipt: settlement,
        responseHeaders: {
          "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
          "X-PAYMENT-RESPONSE": safeBase64Encode(stringify(settlement)),
        },
      };
    } else {
      return {
        status: 402,
        responseHeaders: {
          "Content-Type": "application/json",
        },
        responseBody: {
          x402Version,
          error:
            errorMessages?.settlementFailed ||
            settlement.errorReason ||
            "Settlement failed",
          accepts: paymentRequirements,
        },
      };
    }
  } catch (error) {
    return {
      status: 402,
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseBody: {
        x402Version,
        error:
          errorMessages?.settlementFailed ||
          (error instanceof Error ? error.message : "Settlement error"),
        accepts: paymentRequirements,
      },
    };
  }
}

/**
 * Parses the amount from the given price
 *
 * @param price - The price to parse
 * @param network - The network to get the default asset for
 * @returns The parsed amount or an error message
 */
async function processPriceToAtomicAmount(
  price: Money | ERC20TokenAmount,
  network: FacilitatorNetwork,
  facilitator: ReturnType<typeof facilitatorType>,
): Promise<
  | { maxAmountRequired: string; asset: ERC20TokenAmount["asset"] }
  | { error: string }
> {
  // Handle USDC amount (string) or token amount (ERC20TokenAmount)
  let maxAmountRequired: string;
  let asset: ERC20TokenAmount["asset"];

  if (typeof price === "string" || typeof price === "number") {
    // USDC amount in dollars
    const parsedAmount = moneySchema.safeParse(price);
    if (!parsedAmount.success) {
      return {
        error: `Invalid price (price: ${price}). Must be in the form "$3.10", 0.10, "0.001", ${parsedAmount.error}`,
      };
    }
    const parsedUsdAmount = parsedAmount.data;
    const defaultAsset = await getDefaultAsset(network, facilitator);
    if (!defaultAsset) {
      return {
        error: `Unable to get default asset on ${network}. Please specify an asset in the payment requirements.`,
      };
    }
    asset = defaultAsset;
    maxAmountRequired = (parsedUsdAmount * 10 ** asset.decimals).toString();
  } else {
    // Token amount in atomic units
    maxAmountRequired = price.amount;
    asset = price.asset;
  }

  return {
    maxAmountRequired,
    asset,
  };
}

async function getDefaultAsset(
  network: FacilitatorNetwork,
  facilitator: ReturnType<typeof facilitatorType>,
): Promise<ERC20TokenAmount["asset"] | undefined> {
  const supportedAssets = await facilitator.supported();
  const chainId = networkToChainId(network);
  const matchingAsset = supportedAssets.kinds.find(
    (supported) => supported.network === `eip155:${chainId}`,
  );
  const assetConfig = matchingAsset?.extra
    ?.defaultAsset as ERC20TokenAmount["asset"];
  return assetConfig;
}
