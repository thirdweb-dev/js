"use client";

import { base } from "thirdweb/chains";
import { PayEmbed, getDefaultToken } from "thirdweb/react";
import { setThirdwebDomains } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

setThirdwebDomains({
  pay: "pay.thirdweb-dev.com",
  rpc: "rpc.thirdweb-dev.com",
  inAppWallet: "embedded-wallet.thirdweb-dev.com",
});

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
            amount: "15",
            chain: base,
            token: getDefaultToken(base, "USDC"),
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
