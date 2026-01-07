"use client";

import { useMemo } from "react";
import { type Address, defineChain } from "thirdweb";
import { BuyWidget, type SupportedFiatCurrency } from "thirdweb/react";
import { NEXT_PUBLIC_BUY_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";

export function BuyWidgetEmbed({
  chainId,
  tokenAddress,
  amount,
  showThirdwebBranding,
  theme,
  currency,
  title,
  description,
  image,
  paymentMethods,
  buttonLabel,
  receiverAddress,
  country,
}: {
  chainId?: number;
  tokenAddress?: Address;
  amount?: string;
  showThirdwebBranding?: boolean;
  theme: "light" | "dark";
  currency?: SupportedFiatCurrency;
  title?: string;
  description?: string;
  image?: string;
  paymentMethods?: ("crypto" | "card")[];
  buttonLabel?: string;
  receiverAddress?: Address;
  country?: string;
}) {
  const client = useMemo(
    () =>
      getConfiguredThirdwebClient({
        clientId: NEXT_PUBLIC_BUY_IFRAME_CLIENT_ID,
        secretKey: undefined,
        teamId: undefined,
      }),
    [],
  );

  const chain = useMemo(() => {
    if (!chainId) return undefined;
    // eslint-disable-next-line no-restricted-syntax
    return defineChain(chainId);
  }, [chainId]);

  return (
    <BuyWidget
      className="shadow-xl"
      client={client}
      chain={chain}
      tokenAddress={tokenAddress}
      amount={amount}
      showThirdwebBranding={showThirdwebBranding}
      theme={theme}
      currency={currency}
      title={title}
      description={description}
      image={image}
      paymentMethods={paymentMethods}
      buttonLabel={buttonLabel}
      receiverAddress={receiverAddress}
      country={country}
      onSuccess={() => {
        sendMessageToParent({
          source: "buy-widget",
          type: "success",
        });
      }}
      onError={(error) => {
        sendMessageToParent({
          source: "buy-widget",
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
