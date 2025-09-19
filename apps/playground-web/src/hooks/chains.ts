"use client";

import { useQuery } from "@tanstack/react-query";
import { THIRDWEB_CLIENT } from "../lib/client";
import { isProd } from "../lib/env";

type BridgeChain = {
  chainId: number;
  name: string;
  icon: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

async function fetchBridgeSupportedChainsFromApi() {
  const res = await fetch(
    `https://bridge.${isProd ? "thirdweb.com" : "thirdweb-dev.com"}/v1/chains`,
    {
      headers: {
        "x-client-id": THIRDWEB_CLIENT.clientId,
      },
    },
  );
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as BridgeChain[];
}

export function useBridgeSupportedChains() {
  return useQuery({
    queryFn: async () => {
      return fetchBridgeSupportedChainsFromApi();
    },
    queryKey: ["bridge-supported-chains"],
  });
}
