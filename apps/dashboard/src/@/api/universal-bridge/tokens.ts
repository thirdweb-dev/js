"use server";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
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
