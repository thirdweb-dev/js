import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { UB_BASE_URL } from "./constants";
import type { TokenMetadata } from "./types";

export async function getUniversalBridgeTokens(props: {
  chainId?: number;
  address?: string;
}) {
  const url = new URL(`${UB_BASE_URL}/v1/tokens`);

  if (props.chainId) {
    url.searchParams.append("chainId", String(props.chainId));
  }
  if (props.address) {
    url.searchParams.append("tokenAddress", props.address);
  }
  url.searchParams.append("limit", "1000");
  url.searchParams.append("includePrices", "false");

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
    },
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}
