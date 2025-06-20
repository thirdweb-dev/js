"use client";

import { avalanche } from "thirdweb/chains";
import { ChainIcon, ChainName, ChainProvider } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";

export function ChainIconPreview() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainIcon
        className="h-auto w-20 rounded-full"
        client={THIRDWEB_CLIENT}
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
