"use client";

import { useQuery } from "@tanstack/react-query";
import type { TokenMetadata } from "@/lib/types";

async function fetchTokensFromApi(chainId?: number) {
  const bridgeDomain =
    process.env.NEXT_PUBLIC_BRIDGE_URL || "bridge.thirdweb.com";
  const apiDomain = process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com";
  const bridgeUrl = new URL(
    `${bridgeDomain.includes("localhost") ? "http" : "https"}://${bridgeDomain}/v1/tokens`,
  );
  const apiUrl = new URL(
    `${apiDomain.includes("localhost") ? "http" : "https"}://${apiDomain}/v1/payments/x402/supported`,
  );

  if (chainId) {
    bridgeUrl.searchParams.append("chainId", String(chainId));
    apiUrl.searchParams.append("chainId", String(chainId));
  }
  bridgeUrl.searchParams.append("limit", "1000");
  bridgeUrl.searchParams.append("includePrices", "false");

  const res = await fetch(bridgeUrl.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tokens");
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message);
  }

  const bridgeTokens = json.data as Array<TokenMetadata>;

  if (bridgeTokens.length === 0 && chainId) {
    // try the x402 supported api, which supports testnets
    const apiRes = await fetch(apiUrl.toString(), {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
      },
    });
    if (!apiRes.ok) {
      throw new Error("Failed to fetch supported tokens");
    }
    const apiJson = await apiRes.json();
    if (apiJson.error) {
      throw new Error(apiJson.error.message);
    }
    const apiTokens = apiJson as {
      kinds: Array<{
        x402Version: 1;
        scheme: "exact";
        network: string;
        extra: {
          defaultAsset: {
            address: string;
            decimals: number;
            eip712: {
              name: string;
              version: string;
              primaryType: "TransferWithAuthorization" | "Permit";
            };
          };
          supportedAssets?: Array<{
            address: string;
            decimals: number;
            eip712: {
              name: string;
              version: string;
              primaryType: "TransferWithAuthorization" | "Permit";
            };
          }>;
        };
      }>;
    };
    const result = apiTokens.kinds
      .flatMap((token) => {
        const assets = token.extra?.defaultAsset
          ? [token.extra?.defaultAsset]
          : (token.extra?.supportedAssets ?? []);
        return assets.map((asset) => ({
          chainId: chainId,
          address: asset.address,
          decimals: asset.decimals,
          symbol: asset.eip712.name,
          name: asset.eip712.name,
        })) as TokenMetadata[];
      })
      .filter((token) => token !== undefined)
      .flat();
    return result;
  }
  return bridgeTokens;
}

export function useTokensData({
  chainId,
  enabled = true,
}: {
  chainId?: number;
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryFn: () => fetchTokensFromApi(chainId),
    queryKey: ["tokens", chainId], // 2 minutes
    staleTime: 1000 * 60 * 2,
  });
}
