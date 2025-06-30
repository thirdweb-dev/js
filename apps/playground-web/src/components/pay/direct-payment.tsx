"use client";
import { base } from "thirdweb/chains";
import { CheckoutWidget } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";

export function BuyMerchPreview() {
  return (
    <>
      <CheckoutWidget
        amount={"2"}
        chain={base}
        client={THIRDWEB_CLIENT}
        description="Get your ticket for The Midnight Live"
        feePayer="seller"
        image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop"
        name="Concert Ticket"
        seller="0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675"
        theme="light"
        tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      />
    </>
  );
}
