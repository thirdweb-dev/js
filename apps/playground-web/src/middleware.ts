import { type NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, defineChain } from "thirdweb";
import { facilitator, settlePayment } from "thirdweb/x402";

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

  // TODO (402): dynamic from playground config
  // const amount = queryParams.get("amount");
  // const tokenAddress = queryParams.get("tokenAddress");
  // const decimals = queryParams.get("decimals");

  const result = await settlePayment({
    resourceUrl,
    method,
    paymentData,
    payTo: payTo as `0x${string}`,
    network: defineChain(Number(chainId)),
    price: "$0.01",
    // price: {
    //   amount: toUnits(amount as string, parseInt(decimals as string)).toString(),
    //   asset: {
    //     address: tokenAddress as `0x${string}`,
    //     decimals: decimals ? parseInt(decimals) : token.decimals,
    //     eip712: {
    //       name: token.name,
    //       version: token.version,
    //     },
    //   },
    // },
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
