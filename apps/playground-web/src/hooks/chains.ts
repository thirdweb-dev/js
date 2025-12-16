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

  const data = json.data as BridgeChain[];

  return data.sort((a, b) => {
    const aStartsWithNumber = a.name[0]?.match(/^\d/);
    const bStartsWithNumber = b.name[0]?.match(/^\d/);

    if (aStartsWithNumber && !bStartsWithNumber) {
      return 1;
    }

    if (!aStartsWithNumber && bStartsWithNumber) {
      return -1;
    }

    return a.name.localeCompare(b.name);
  });
}

export function useBridgeSupportedChains() {
  return useQuery({
    queryFn: async () => {
      return fetchBridgeSupportedChainsFromApi();
    },
    queryKey: ["bridge-supported-chains"],
  });
}
