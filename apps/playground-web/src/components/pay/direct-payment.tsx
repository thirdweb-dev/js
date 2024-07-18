"use client";

import { base } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";
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
            amount: "35",
            chain: base,
            currency: {
              address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
              name: "USD Coin",
              symbol: "USDC",
              decimals: 6,
            },
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
