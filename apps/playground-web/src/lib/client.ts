import { createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";

setThirdwebDomains({
  inAppWallet: process.env.NEXT_PUBLIC_IN_APP_WALLET_URL,
  rpc: process.env.NEXT_PUBLIC_RPC_URL,
  social: process.env.NEXT_PUBLIC_SOCIAL_URL,
  storage: process.env.NEXT_PUBLIC_STORAGE_URL,
  bundler: process.env.NEXT_PUBLIC_BUNDLER_URL,
  pay: process.env.NEXT_PUBLIC_PAY_URL,
  analytics: process.env.NEXT_PUBLIC_ANALYTICS_URL,
  insight: process.env.NEXT_PUBLIC_INSIGHT_URL,
});

const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_RPC_URL?.endsWith(".thirdweb-dev.com");

export const THIRDWEB_CLIENT = createThirdwebClient(
  process.env.THIRDWEB_SECRET_KEY
    ? {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
        config: {
          storage: isDev
            ? {
                gatewayUrl: "https://gateway.pinata.cloud/ipfs/",
              }
            : undefined,
        },
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
