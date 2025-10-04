import { type NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, defineChain } from "thirdweb";
import { toUnits } from "thirdweb/utils";
import { facilitator, settlePayment } from "thirdweb/x402";
import { token } from "../../payments/x402/components/constants";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY as string,
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
  const tokenAddress = queryParams.get("tokenAddress") || token.address;
  const decimals = queryParams.get("decimals") || token.decimals.toString();
  const waitUntil =
    (queryParams.get("waitUntil") as "simulated" | "submitted" | "confirmed") ||
    "simulated";

  const result = await settlePayment({
    resourceUrl: "https://playground-web.thirdweb.com/api/paywall",
    method: "GET",
    paymentData,
    network: defineChain(Number(chainId)),
    price: {
      amount: toUnits(amount, parseInt(decimals)).toString(),
      asset: {
        address: tokenAddress as `0x${string}`,
        decimals: decimals ? parseInt(decimals) : token.decimals,
      },
    },
    routeConfig: {
      description: "Access to paid content",
    },
    waitUntil,
    facilitator: twFacilitator,
  });

  if (result.status === 200) {
    // payment successful, execute the request
    return NextResponse.json(
      {
        success: true,
        message: "Payment successful. You have accessed the protected route.",
        payment: {
          amount,
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
