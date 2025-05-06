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
import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
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
  theme?: "light" | "dark";
}) {
  const { theme: browserTheme, setTheme } = useTheme();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

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
        theme={theme ?? (browserTheme === "light" ? "light" : "dark")}
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
            if (result.type === "transaction") {
              url.searchParams.set("txHash", result.transactionHash);
              return window.open(url.toString());
            }
            if (result.status.status === "NOT_FOUND") {
              throw new Error("Transaction not found");
            }
            const txHash = result.status.source?.transactionHash;
            if (typeof txHash === "string") {
              url.searchParams.set("txHash", txHash);
            }
          },
        }}
      />
    </>
  );
}
