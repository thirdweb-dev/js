"use client";
import { toUnits } from "thirdweb";
import { base } from "thirdweb/chains";
import { CheckoutWidget } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";

export function BuyMerchPreview() {
  return (
    <>
      <CheckoutWidget
        client={THIRDWEB_CLIENT}
        theme="light"
        chain={base}
        amount={toUnits("2", 6)}
        tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        seller="0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675"
        feePayer="seller"
        name="Black Hoodie"
        description="Size L | Ships worldwide."
      />
    </>
  );
}
