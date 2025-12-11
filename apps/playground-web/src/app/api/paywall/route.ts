import { type NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, defineChain } from "thirdweb";
import { toUnits } from "thirdweb/utils";
import { facilitator, settlePayment, verifyPayment } from "thirdweb/x402";
import { token } from "../../x402/components/constants";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY as string;

  const client = createThirdwebClient({
    secretKey: SECRET_KEY,
  });

  const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;
  // const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_SMART_WALLET as string;
  const ENGINE_VAULT_ACCESS_TOKEN = process.env
    .ENGINE_VAULT_ACCESS_TOKEN as string;
  const API_URL = `https://${process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com"}`;

  const twFacilitator = facilitator({
    baseUrl: `${API_URL}/v1/payments/x402`,
    client,
    serverWalletAddress: BACKEND_WALLET_ADDRESS,
    vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
  });

  const paymentData = request.headers.get("X-PAYMENT");
  const queryParams = request.nextUrl.searchParams;

  const chainId = queryParams.get("chainId");

  if (!chainId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const amount = queryParams.get("amount") || "0.01";
  const payTo = queryParams.get("payTo") ?? undefined;
  const tokenAddress = queryParams.get("tokenAddress");
  const decimals = queryParams.get("decimals") || token.decimals.toString();
  const waitUntil =
    (queryParams.get("waitUntil") as "simulated" | "submitted" | "confirmed") ||
    "simulated";
  const scheme = (queryParams.get("scheme") as "exact" | "upto") || "exact";
  const minPriceAmount = queryParams.get("minPrice");
  const settlementAmount = queryParams.get("settlementAmount");

  const priceConfig = tokenAddress
    ? {
        amount: toUnits(amount, parseInt(decimals)).toString(),
        asset: {
          address: tokenAddress as `0x${string}`,
          decimals: decimals ? parseInt(decimals) : token.decimals,
        },
      }
    : amount;

  const minPriceConfig =
    scheme === "upto" && minPriceAmount
      ? tokenAddress
        ? {
            amount: toUnits(minPriceAmount, parseInt(decimals)).toString(),
            asset: {
              address: tokenAddress as `0x${string}`,
              decimals: decimals ? parseInt(decimals) : token.decimals,
            },
          }
        : minPriceAmount
      : undefined;

  let finalPriceConfig = priceConfig;

  const paymentArgs = {
    resourceUrl: "https://playground-web.thirdweb.com/api/paywall",
    method: "GET",
    paymentData,
    network: defineChain(Number(chainId)),
    payTo,
    scheme,
    price: priceConfig,
    minPrice: minPriceConfig,
    routeConfig: {
      description: "Access to paid content",
    },
    waitUntil,
    facilitator: twFacilitator,
  };

  if (minPriceConfig) {
    const verifyResult = await verifyPayment(paymentArgs);

    if (verifyResult.status !== 200) {
      return NextResponse.json(verifyResult.responseBody, {
        status: verifyResult.status,
        headers: verifyResult.responseHeaders,
      });
    }

    // If settlementAmount is provided, override the price for settlement
    if (settlementAmount) {
      finalPriceConfig = tokenAddress
        ? {
            amount: toUnits(settlementAmount, parseInt(decimals)).toString(),
            asset: {
              address: tokenAddress as `0x${string}`,
              decimals: decimals ? parseInt(decimals) : token.decimals,
            },
          }
        : settlementAmount;
    }
  }

  const result = await settlePayment({
    ...paymentArgs,
    price: finalPriceConfig,
  });

  if (result.status === 200) {
    // payment successful, execute the request
    return NextResponse.json(
      {
        success: true,
        message: "Payment successful. You have accessed the protected route.",
        payment: {
          amount: settlementAmount || amount,
          tokenAddress,
        },
        receipt: result.paymentReceipt,
      },
      {
        status: 200,
        headers: result.responseHeaders,
      },
    );
  }

  // otherwise, request payment
  return NextResponse.json(result.responseBody, {
    status: result.status,
    headers: result.responseHeaders,
  });
}
