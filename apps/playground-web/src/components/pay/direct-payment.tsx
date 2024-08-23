"use client";

import { sepolia } from "thirdweb/chains";
import { PayEmbed, getDefaultToken } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

export function BuyMerchPreview() {
  return (
    <>
      <StyledConnectButton />
      <div className="h-10" />
      <PayEmbed
        client={THIRDWEB_CLIENT}
        theme={"light"}
        payOptions={{
          mode: "direct_payment",
          paymentInfo: {
            amount: "0.1",
            chain: sepolia,
            token: getDefaultToken(sepolia, "USDC"),
            sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
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
