"use client";
import { payAppThirdwebClient } from "app/pay/constants";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { NATIVE_TOKEN_ADDRESS, toTokens } from "thirdweb";
import { AutoConnect, PayEmbed } from "thirdweb/react";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";

export function PayPageEmbed({
  chainId,
  recipientAddress,
  paymentLinkId,
  amount,
  token,
  name,
  image,
  redirectUri,
  theme,
  purchaseData,
}: {
  chainId: number;
  recipientAddress: string;
  paymentLinkId?: string;
  amount?: bigint;
  token: { name: string; symbol: string; address: string; decimals: number };
  name?: string;
  image?: string;
  redirectUri?: string;
  clientId: string;
  theme?: "light" | "dark";
  purchaseData: Record<string, unknown> | undefined;
}) {
  const { theme: browserTheme, setTheme } = useTheme();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [theme, setTheme]);
  const chain = useV5DashboardChain(chainId);

  return (
    <>
      <AutoConnect client={payAppThirdwebClient} />
      <PayEmbed
        client={payAppThirdwebClient}
        paymentLinkId={paymentLinkId}
        payOptions={{
          metadata: {
            image,
            name,
          },
          mode: "direct_payment",
          onPurchaseSuccess: (result) => {
            if (!redirectUri) return;
            const url = new URL(redirectUri);
            switch (result?.type) {
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
          paymentInfo: {
            amount: amount ? toTokens(amount, token.decimals) : "0.01",
            chain,
            sellerAddress: recipientAddress,
            token: token.address === NATIVE_TOKEN_ADDRESS ? undefined : token,
          },
          purchaseData,
        }}
        theme={theme ?? (browserTheme === "light" ? "light" : "dark")}
      />
    </>
  );
}
