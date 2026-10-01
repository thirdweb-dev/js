"use server";
import "server-only";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

type ChainIntegrationRequest = {
  companyName: string;
  telegram: string;
  email: string;
  chainName: string;
  chainShortName: string;
  chainId: string;
  publicRpc: string;
  iconUrl: string;
  iconWidth: string;
  iconHeight: string;
  iconFormat: string;
  nativeCurrencyName: string;
  nativeCurrencySymbol: string;
  nativeCurrencyDecimals: string;
  blockExplorerUrl: string;
  blockExplorerStandard: string;
  explorerIconWidth: string;
  explorerIconHeight: string;
  explorerIconFormat: string;
  faucetOrBridge: string;
  chainStack?: string;
};

export async function submitChainIntegrationRequest(
  request: ChainIntegrationRequest,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "You are not logged in", ok: false };
  }

  const res = await fetch(
    new URL("/v1/chains/integration-requests", NEXT_PUBLIC_THIRDWEB_API_HOST),
    {
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    return {
      error:
        res.status === 429
          ? "Too many requests, please try again in a minute"
          : "Failed to submit request, please try again later",
      ok: false,
    };
  }

  return { ok: true };
}
