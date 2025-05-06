"use client";
import {
  THIRDWEB_ANALYTICS_DOMAIN,
  THIRDWEB_BUNDLER_DOMAIN,
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_INSIGHT_API_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_SOCIAL_API_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "constants/urls";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getVercelEnv } from "lib/vercel-utils";
import { useMemo } from "react";
import { NATIVE_TOKEN_ADDRESS, createThirdwebClient, toTokens } from "thirdweb";
import { AutoConnect, PayEmbed } from "thirdweb/react";
import { setThirdwebDomains } from "thirdweb/utils";

export function CheckoutEmbed({
  chainId,
  recipientAddress,
  amount,
  token,
  name,
  image,
  redirectUri,
  clientId,
  theme,
}: {
  chainId: number;
  recipientAddress: string;
  amount: bigint;
  token: { name: string; symbol: string; address: string; decimals: number };
  name?: string;
  image?: string;
  redirectUri?: string;
  clientId: string;
  theme: "light" | "dark";
}) {
  const client = useMemo(() => {
    if (getVercelEnv() !== "production") {
      setThirdwebDomains({
        rpc: THIRDWEB_RPC_DOMAIN,
        pay: THIRDWEB_PAY_DOMAIN,
        storage: THIRDWEB_STORAGE_DOMAIN,
        insight: THIRDWEB_INSIGHT_API_DOMAIN,
        analytics: THIRDWEB_ANALYTICS_DOMAIN,
        inAppWallet: THIRDWEB_INAPP_WALLET_DOMAIN,
        bundler: THIRDWEB_BUNDLER_DOMAIN,
        social: THIRDWEB_SOCIAL_API_DOMAIN,
      });
    }
    return createThirdwebClient({ clientId });
  }, [clientId]);
  const chain = useV5DashboardChain(chainId);

  return (
    <>
      <AutoConnect client={client} />
      <PayEmbed
        client={client}
        theme={theme === "light" ? "light" : "dark"}
        payOptions={{
          metadata: {
            name,
            image,
          },
          mode: "direct_payment",
          paymentInfo: {
            chain,
            sellerAddress: recipientAddress,
            amount: toTokens(amount, token.decimals),
            token: token.address === NATIVE_TOKEN_ADDRESS ? undefined : token,
          },
          onPurchaseSuccess: (result) => {
            if (!redirectUri) return;
            const url = new URL(redirectUri);
            switch (result.type) {
              case "crypto": {
                url.searchParams.set("status", result.status.status);
                if (
                  "source" in result.status &&
                  result.status.source?.transactionHash
                ) {
                  url.searchParams.set(
                    "txHash",
                    result.status.source?.transactionHash,
                  );
                }
                break;
              }
              case "fiat": {
                url.searchParams.set("status", result.status.status);
                if ("intentId" in result.status) {
                  url.searchParams.set("intentId", result.status.intentId);
                }
                break;
              }
              case "transaction": {
                url.searchParams.set("txHash", result.transactionHash);
                break;
              }
            }
            return window.open(url.toString());
          },
        }}
      />
    </>
  );
}
