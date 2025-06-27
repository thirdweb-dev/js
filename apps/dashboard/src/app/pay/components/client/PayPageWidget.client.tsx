"use client";
import { payAppThirdwebClient } from "app/pay/constants";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { createThirdwebClient, NATIVE_TOKEN_ADDRESS, toTokens } from "thirdweb";
import { AutoConnect, CheckoutWidget } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";

export function PayPageWidget({
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
  clientId,
}: {
  chainId: number;
  recipientAddress: string;
  paymentLinkId?: string;
  amount?: bigint;
  token: { name: string; symbol: string; address: string; decimals: number };
  name?: string;
  image?: string;
  redirectUri?: string;
  clientId: string | undefined;
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
      <AutoConnect
        client={
          clientId ? createThirdwebClient({ clientId }) : payAppThirdwebClient
        }
      />
      <CheckoutWidget
        amount={amount ? toTokens(amount, token.decimals) : "0"}
        chain={chain}
        client={
          clientId ? createThirdwebClient({ clientId }) : payAppThirdwebClient
        }
        image={image}
        name={name}
        onSuccess={() => {
          if (!redirectUri) return;
          const url = new URL(redirectUri);
          return window.open(url.toString());
        }}
        paymentLinkId={paymentLinkId}
        purchaseData={purchaseData}
        seller={checksumAddress(recipientAddress)}
        theme={theme ?? (browserTheme === "light" ? "light" : "dark")}
        tokenAddress={
          token.address === NATIVE_TOKEN_ADDRESS
            ? undefined
            : checksumAddress(token.address)
        }
      />
    </>
  );
}
