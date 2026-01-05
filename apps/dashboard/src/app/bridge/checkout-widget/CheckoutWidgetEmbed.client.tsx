"use client";

import { useMemo } from "react";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb";
import { CheckoutWidget, type SupportedFiatCurrency } from "thirdweb/react";
import { NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";

export function CheckoutWidgetEmbed({
  chainId,
  amount,
  seller,
  tokenAddress,
  name,
  description,
  image,
  buttonLabel,
  feePayer,
  country,
  showThirdwebBranding,
  theme,
  currency,
  paymentMethods,
}: {
  chainId: number;
  amount: string;
  seller: Address;
  tokenAddress?: Address;
  name?: string;
  description?: string;
  image?: string;
  buttonLabel?: string;
  feePayer?: "user" | "seller";
  country?: string;
  showThirdwebBranding?: boolean;
  theme: "light" | "dark";
  currency?: SupportedFiatCurrency;
  paymentMethods?: ("crypto" | "card")[];
}) {
  const client = useMemo(
    () =>
      getConfiguredThirdwebClient({
        clientId: NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID,
        secretKey: undefined,
        teamId: undefined,
      }),
    [],
  );

  // eslint-disable-next-line no-restricted-syntax
  const chain = useMemo(() => defineChain(chainId), [chainId]);

  return (
    <CheckoutWidget
      className="shadow-xl"
      client={client}
      chain={chain}
      amount={amount}
      seller={seller}
      tokenAddress={tokenAddress}
      name={name}
      description={description}
      image={image}
      buttonLabel={buttonLabel}
      feePayer={feePayer}
      country={country}
      showThirdwebBranding={showThirdwebBranding}
      theme={theme}
      currency={currency}
      paymentMethods={paymentMethods}
      onSuccess={() => {
        sendMessageToParent({
          source: "checkout-widget",
          type: "success",
        });
      }}
      onError={(error) => {
        sendMessageToParent({
          source: "checkout-widget",
          type: "error",
          message: error.message,
        });
      }}
    />
  );
}

function sendMessageToParent(content: object) {
  try {
    window.parent.postMessage(content, "*");
  } catch (error) {
    console.error("Failed to send post message to parent window");
    console.error(error);
  }
}
