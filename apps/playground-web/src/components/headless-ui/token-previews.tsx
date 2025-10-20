"use client";

import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import {
  TokenIcon,
  TokenName,
  TokenProvider,
  TokenSymbol,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export function TokenImageBasicPreview() {
  return (
    <TokenProvider
      address={NATIVE_TOKEN_ADDRESS}
      chain={ethereum}
      client={THIRDWEB_CLIENT}
    >
      <TokenIcon className="h-auto w-20 rounded-full" />
    </TokenProvider>
  );
}

export function TokenImageOverridePreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      chain={ethereum}
      client={THIRDWEB_CLIENT}
    >
      <TokenIcon className="h-auto w-20 rounded-full" />
    </TokenProvider>
  );
}

export function TokenNameBasicPreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      chain={ethereum}
      client={THIRDWEB_CLIENT}
    >
      <TokenName loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  );
}

export function TokenSymbolBasicPreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      chain={ethereum}
      client={THIRDWEB_CLIENT}
    >
      <TokenSymbol loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  );
}
