"use server";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { getAuthToken } from "app/(app)/api/lib/getAuthToken";
import { UB_BASE_URL } from "./constants";

export type TokenMetadata = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
  iconUri?: string;
};

export async function getUniversalBridgeTokens(props: {
  chainId?: number;
}) {
  const url = new URL(`${UB_BASE_URL}/v1/tokens`);

  if (props.chainId) {
    url.searchParams.append("chainId", String(props.chainId));
  }
  url.searchParams.append("limit", "1000");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
    } as Record<string, string>,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}

export async function addUniversalBridgeTokenRoute(props: {
  chainId: number;
  tokenAddress: string;
  project: ProjectResponse;
}) {
  const authToken = await getAuthToken();
  const url = new URL(`${UB_BASE_URL}/v1/tokens`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      "x-client-id": props.project.publishableKey,
    } as Record<string, string>,
    body: JSON.stringify({
      chainId: props.chainId,
      tokenAddress: props.tokenAddress,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}
