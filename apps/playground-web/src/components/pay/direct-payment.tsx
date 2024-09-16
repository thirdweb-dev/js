"use client";

import { arbitrum, polygon } from "thirdweb/chains";
import { PayEmbed, getDefaultToken } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

export function BuyMerchPreview() {
  function parseEther(arg0: string): bigint {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <StyledConnectButton />
      <PayEmbed
        client={THIRDWEB_CLIENT}
        // Also tried calling onPurchaseSuccess directly but got no response.
        // onPurchaseSuccess={() => {
        //    console.log('Payment successful');
        //  }}
        payOptions={{
          mode: "direct_payment",
          buyWithFiat: false,
          paymentInfo: {
            amount: "0.01",
            chain: arbitrum,
            token: getDefaultToken(arbitrum, "USDC"),
            sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
          },
          metadata: {
            name: `Top up ${0.01} USDC to wallet`,
          },
          onPurchaseSuccess: () => {
            // This callback is not being triggered.
            console.log("Payment successful");
          },
        }}
      />
      <div className="h-10" />
      <PayEmbed
        client={THIRDWEB_CLIENT}
        theme={"light"}
        payOptions={{
          mode: "direct_payment",
          paymentInfo: {
            amount: "0.01",
            chain: polygon,
            token: getDefaultToken(polygon, "USDC"),
            sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
          },
          buyWithFiat: {
            testMode: true,
          },
          metadata: {
            name: "Black Hoodie (Size L)",
            image: "/drip-hoodie.png",
          },
        }}
      />
      <div className="h-10" />
    </>
  );
}
