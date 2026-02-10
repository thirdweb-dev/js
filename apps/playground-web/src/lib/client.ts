import { createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";

setThirdwebDomains({
  analytics: process.env.NEXT_PUBLIC_ANALYTICS_URL,
  // default to local bridge in playground if not explicitly configured
  bridge:
    process.env.NEXT_PUBLIC_BRIDGE_URL ??
    (process.env.NODE_ENV === "development" ? "localhost:4242" : undefined),
  bundler: process.env.NEXT_PUBLIC_BUNDLER_URL,
  inAppWallet: process.env.NEXT_PUBLIC_IN_APP_WALLET_URL,
  insight: process.env.NEXT_PUBLIC_INSIGHT_URL,
  pay: process.env.NEXT_PUBLIC_PAY_URL,
  rpc: process.env.NEXT_PUBLIC_RPC_URL,
  social: process.env.NEXT_PUBLIC_SOCIAL_URL,
  storage: process.env.NEXT_PUBLIC_STORAGE_URL,
});

const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_RPC_URL?.endsWith(".thirdweb-dev.com");

export const THIRDWEB_CLIENT = createThirdwebClient(
  process.env.THIRDWEB_SECRET_KEY
    ? {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
        config: {
          storage: isDev
            ? {
                gatewayUrl: "https://gateway.pinata.cloud/ipfs/",
              }
            : undefined,
        },
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      }
    : {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
        config: {
          storage: isDev
            ? {
                gatewayUrl: "https://gateway.pinata.cloud/ipfs/",
              }
            : undefined,
        },
      },
);
