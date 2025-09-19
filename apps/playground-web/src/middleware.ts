import { createThirdwebClient } from "thirdweb";
import { facilitator } from "thirdweb/x402";
import { paymentMiddleware } from "x402-next";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;
const ENGINE_VAULT_ACCESS_TOKEN = process.env
  .ENGINE_VAULT_ACCESS_TOKEN as string;
const API_URL = `https://${process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com"}`;

export const middleware = paymentMiddleware(
  "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
  {
    "/api/paywall": {
      price: "$0.01",
      network: "base-sepolia",
      config: {
        description: "Access to paid content",
      },
    },
  },
  facilitator({
    baseUrl: `${API_URL}/v1/payments/x402`,
    client,
    serverWalletAddress: BACKEND_WALLET_ADDRESS,
    vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
  }),
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/paywall"],
};
