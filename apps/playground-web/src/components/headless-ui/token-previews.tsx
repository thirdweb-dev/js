"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import {
  TokenIcon,
  TokenName,
  TokenProvider,
  TokenSymbol,
} from "thirdweb/react";

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export function TokenImageBasicPreview() {
  return (
    <TokenProvider
      address={NATIVE_TOKEN_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenIcon className="h-auto w-20 rounded-full" />
    </TokenProvider>
  );
}

export function TokenImageOverridePreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenIcon
        className="h-auto w-20 rounded-full"
        iconResolver="/usdc.svg"
      />
    </TokenProvider>
  );
}

export function TokenNameBasicPreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenName loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  );
}

export function TokenSymbolBasicPreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenSymbol loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  );
}

export function TokenCardPreview() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <div className="flex flex-row items-center gap-2 rounded-lg border bg-slate-950 px-4 py-1">
        <TokenIcon className="h-10 w-10" iconResolver="/usdc.svg" />
        <div className="flex flex-col">
          <TokenName
            className="font-bold"
            loadingComponent={<span>Loading...</span>}
          />
          <TokenSymbol
            className="text-gray-500"
            loadingComponent={<span>Loading...</span>}
          />
        </div>
      </div>
    </TokenProvider>
  );
}
