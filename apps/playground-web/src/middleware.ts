import { type NextRequest, NextResponse } from "next/server";
import { createThirdwebClient } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { facilitator, settlePayment } from "thirdweb/x402";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const chain = arbitrumSepolia;
const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;
const ENGINE_VAULT_ACCESS_TOKEN = process.env
  .ENGINE_VAULT_ACCESS_TOKEN as string;
const API_URL = `https://${process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com"}`;

const twFacilitator = facilitator({
  baseUrl: `${API_URL}/v1/payments/x402`,
  client,
  serverWalletAddress: BACKEND_WALLET_ADDRESS,
  vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  const resourceUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`;
  const paymentData = request.headers.get("X-PAYMENT");

  const result = await settlePayment({
    resourceUrl,
    method,
    paymentData,
    payTo: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
    network: chain,
    price: "$0.01",
    routeConfig: {
      description: "Access to paid content",
    },
    facilitator: twFacilitator,
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
