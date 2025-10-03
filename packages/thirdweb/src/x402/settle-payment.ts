import { stringify } from "../utils/json.js";
import { decodePaymentRequest } from "./common.js";
import { safeBase64Encode } from "./encode.js";
import {
  type SettlePaymentArgs,
  type SettlePaymentResult,
  x402Version,
} from "./types.js";

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
 *
 * ### Next.js API route example
 *
 * ```ts
 * // Usage in a Next.js API route
 * import { settlePayment, facilitator } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 * import { arbitrumSepolia } from "thirdweb/chains";
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
 *   // verify and process the payment
 *   const result = await settlePayment({
 *     resourceUrl: "https://api.example.com/premium-content",
 *     method: "GET",
 *     paymentData,
 *     payTo: "0x1234567890123456789012345678901234567890",
 *     network: arbitrumSepolia, // or any other chain
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
 *     return Response.json({ data: "premium content" });
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
 * ### Express middleware example
 *
 * ```ts
 * // Usage in Express middleware
 * import express from "express";
 * import { settlePayment, facilitator } from "thirdweb/x402";
 * import { createThirdwebClient } from "thirdweb";
 * import { arbitrumSepolia } from "thirdweb/chains";
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
 * const app = express();
 *
 * async function paymentMiddleware(req, res, next) {
 *   // verify and process the payment
 *   const result = await settlePayment({
 *     resourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
 *     method: req.method,
 *     paymentData: req.headers["x-payment"],
 *     payTo: "0x1234567890123456789012345678901234567890",
 *     network: arbitrumSepolia, // or any other chain
 *     price: "$0.05",
 *     waitUntil: "submitted",
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
export async function settlePayment(
  args: SettlePaymentArgs,
): Promise<SettlePaymentResult> {
  const { routeConfig = {}, facilitator } = args;
  const { errorMessages } = routeConfig;

  const decodePaymentResult = await decodePaymentRequest(args);

  if (decodePaymentResult.status !== 200) {
    return decodePaymentResult;
  }

  const { selectedPaymentRequirements, decodedPayment, paymentRequirements } =
    decodePaymentResult;

  try {
    const settlement = await facilitator.settle(
      decodedPayment,
      selectedPaymentRequirements,
      args.waitUntil,
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
      const error = settlement.errorReason || "Settlement error";
      return {
        status: 402,
        responseHeaders: {
          "Content-Type": "application/json",
        },
        responseBody: {
          x402Version,
          error,
          errorMessage:
            errorMessages?.settlementFailed || settlement.errorMessage,
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
        error: "Settlement error",
        errorMessage:
          errorMessages?.settlementFailed ||
          (error instanceof Error ? error.message : undefined),
        accepts: paymentRequirements,
      },
    };
  }
}
