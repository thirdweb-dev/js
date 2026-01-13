import { decodePaymentRequest } from "./common.js";
import {
  type PaymentArgs,
  type VerifyPaymentResult,
  x402Version,
} from "./types.js";

/**
 * Verifies X402 payments for protected resources. This function only verifies the payment,
 * you should use `settlePayment` to settle the payment.
 *
 * @param args - Configuration object containing payment verification parameters
 * @returns A promise that resolves to either a successful verification result (200) or payment required error (402)
 *
 * @example
 * ```ts
 * // Usage in a Next.js API route
 * import { verifyPayment, facilitator } from "thirdweb/x402";
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
 *   const paymentData =
 *     request.headers.get("payment-signature") ??
 *     request.headers.get("x-payment");
 *
 *   const paymentArgs = {
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
 *     },
 *   };
 *
 *   // verify the payment
 *   const result = await verifyPayment(paymentArgs);
 *
 *   if (result.status === 200) {
 *     // Payment verified, but not settled yet
 *     // you can do the work that requires payment first
 *     const result = await doSomething();
 *     // then settle the payment
 *     const settleResult = await settlePayment(paymentArgs);
 *
 *     // then return the result
 *     return Response.json(result);
 *   } else {
 *     // verification failed, return payment required
 *     return Response.json(result.responseBody, {
 *       status: result.status,
 *       headers: result.responseHeaders,
 *     });
 *   }
 * }
 * ```
 *
 * ### Upto Payment Scheme
 *
 * You can also use the `upto` payment scheme to verify a payment where the final price is dynamically calculated based on the usage.
 *
 * ```ts
 * const result = await verifyPayment({
 *   ...paymentArgs,
 *   scheme: "upto",
 *   price: "$0.10", // max payable amount
 * });
 * ```
 * @public
 * @beta
 * @x402
 */
export async function verifyPayment(
  args: PaymentArgs,
): Promise<VerifyPaymentResult> {
  const { routeConfig = {}, facilitator } = args;
  const { errorMessages } = routeConfig;

  const decodePaymentResult = await decodePaymentRequest(args);

  if (decodePaymentResult.status !== 200) {
    return decodePaymentResult;
  }

  const { selectedPaymentRequirements, decodedPayment, paymentRequirements } =
    decodePaymentResult;

  // Verify payment
  try {
    const verification = await facilitator.verify(
      decodedPayment,
      selectedPaymentRequirements,
    );

    if (verification.isValid) {
      return {
        status: 200,
        decodedPayment,
        selectedPaymentRequirements,
        allowance: verification.allowance,
        balance: verification.balance,
        payer: verification.payer,
      };
    } else {
      const error = verification.invalidReason || "Verification failed";
      return {
        status: 402,
        responseHeaders: {
          "Content-Type": "application/json",
        },
        responseBody: {
          x402Version: decodedPayment.x402Version ?? x402Version,
          error: error,
          errorMessage:
            errorMessages?.verificationFailed || verification.errorMessage,
          fundWalletLink: verification.fundWalletLink,
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
        x402Version: decodedPayment.x402Version ?? x402Version,
        error: "Verification error",
        errorMessage:
          errorMessages?.verificationFailed ||
          (error instanceof Error ? error.message : undefined),
        accepts: paymentRequirements,
      },
    };
  }
}
