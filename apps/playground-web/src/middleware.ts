import { type NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, defineChain } from "thirdweb";
import { toUnits } from "thirdweb/utils";
import { facilitator, settlePayment } from "thirdweb/x402";
import { token } from "./app/payments/x402/components/constants";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;
// const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_SMART_WALLET as string;
const ENGINE_VAULT_ACCESS_TOKEN = process.env
  .ENGINE_VAULT_ACCESS_TOKEN as string;
const API_URL = `https://${process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com"}`;
function createFacilitator(
  waitUntil: "simulated" | "submitted" | "confirmed" = "simulated",
) {
  return facilitator({
    baseUrl: `${API_URL}/v1/payments/x402`,
    client,
    serverWalletAddress: BACKEND_WALLET_ADDRESS,
    vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
    waitUtil: waitUntil,
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  const resourceUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`;
  const paymentData = request.headers.get("X-PAYMENT");
  const queryParams = request.nextUrl.searchParams;

  const chainId = queryParams.get("chainId");
  const payTo = queryParams.get("payTo");

  if (!chainId || !payTo) {
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
    resourceUrl,
    method,
    paymentData,
    payTo: payTo as `0x${string}`,
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
    facilitator: createFacilitator(waitUntil),
  });

  if (result.status === 200) {
    // payment successful, execute the request
    const response = NextResponse.next();
    for (const [key, value] of Object.entries(result.responseHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // otherwise, request payment
  return NextResponse.json(result.responseBody, {
    status: result.status,
    headers: result.responseHeaders,
  });
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/paywall"],
};
