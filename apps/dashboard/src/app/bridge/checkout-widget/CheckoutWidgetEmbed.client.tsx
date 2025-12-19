"use client";

import { useMemo } from "react";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb";
import { CheckoutWidget, type SupportedFiatCurrency } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { appMetadata } from "@/constants/connect";
import { NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";

const bridgeWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata,
  }),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.okex.wallet"),
];

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
      connectOptions={{
        wallets: bridgeWallets,
        appMetadata,
      }}
      onSuccess={(data) => {
        sendMessageToParent("success", data);
      }}
      onError={(error) => {
        sendMessageToParent("error", {
          message: error.message,
        });
      }}
    />
  );
}

function sendMessageToParent(
  type: "success" | "error",
  data: object | undefined,
) {
  try {
    window.parent.postMessage(
      {
        source: "checkout-widget",
        type,
        data,
      },
      "*",
    );
  } catch (error) {
    console.error("Failed to send post message to parent window");
    console.error(error);
  }
}
