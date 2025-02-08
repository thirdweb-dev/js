"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { avalanche } from "thirdweb/chains";
import { ChainIcon, ChainName, ChainProvider } from "thirdweb/react";

export function ChainIconPreview() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainIcon
        client={THIRDWEB_CLIENT}
        className="h-auto w-20 rounded-full"
        loadingComponent={<span>Loading...</span>}
      />
    </ChainProvider>
  );
}

export function ChainNamePreview() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainName loadingComponent={<span>Loading...</span>} />
    </ChainProvider>
  );
}
