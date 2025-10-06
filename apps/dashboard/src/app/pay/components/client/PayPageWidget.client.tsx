"use client";
import { payAppThirdwebClient } from "app/pay/constants";
import { useTheme } from "next-themes";
import { createThirdwebClient, NATIVE_TOKEN_ADDRESS, toTokens } from "thirdweb";
import { AutoConnect, CheckoutWidget } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import {
  reportPaymentLinkBuyFailed,
  reportPaymentLinkBuySuccessful,
} from "@/analytics/report";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function PayPageWidget({
  chainId,
  recipientAddress,
  paymentLinkId,
  amount,
  token,
  name,
  image,
  redirectUri,
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
  purchaseData: Record<string, unknown> | undefined;
}) {
  const { theme } = useTheme();

  const chain = useV5DashboardChain(chainId);

  return (
    <>
      <AutoConnect
        client={
          clientId ? createThirdwebClient({ clientId }) : payAppThirdwebClient
        }
      />
      <CheckoutWidget
        theme={getSDKTheme(theme === "light" ? "light" : "dark")}
        connectOptions={{
          wallets: [
            createWallet("io.metamask"),
            createWallet("io.rabby"),
            createWallet("com.okex.wallet"),
            createWallet("me.rainbow"),
            createWallet("walletConnect"),
          ],
          showAllWallets: true,
        }}
        amount={amount ? toTokens(amount, token.decimals) : "0"}
        chain={chain}
        client={
          clientId ? createThirdwebClient({ clientId }) : payAppThirdwebClient
        }
        image={image}
        name={name}
        onSuccess={() => {
          reportPaymentLinkBuySuccessful();

          if (!redirectUri) return;
          const url = new URL(redirectUri);
          return window.open(url.toString());
        }}
        onError={(error) => {
          reportPaymentLinkBuyFailed({
            errorMessage: error.message,
          });
        }}
        paymentLinkId={paymentLinkId}
        purchaseData={purchaseData}
        seller={checksumAddress(recipientAddress)}
        tokenAddress={
          token.address === NATIVE_TOKEN_ADDRESS
            ? undefined
            : checksumAddress(token.address)
        }
      />
    </>
  );
}
