"use client";
import { base } from "thirdweb/chains";
import { PayEmbed, getDefaultToken } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";

export function BuyMerchPreview() {
  return (
    <>
      <PayEmbed
        client={THIRDWEB_CLIENT}
        theme="light"
        payOptions={{
          mode: "direct_payment",
          paymentInfo: {
            amount: "2",
            chain: base,
            token: getDefaultToken(base, "USDC"),
            sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
            feePayer: "receiver",
          },
          metadata: {
            name: "Black Hoodie (Size L)",
            image: "/drip-hoodie.png",
          },
        }}
      />
    </>
  );
}
