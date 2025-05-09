"use server";
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

export async function getUniversalBrigeTokens(props: {
  clientId?: string;
  chainId?: number;
}) {
  const authToken = await getAuthToken();
  const url = new URL(`${UB_BASE_URL}/v1/tokens`);

  if (props.chainId) {
    url.searchParams.append("chainId", String(props.chainId));
  }
  url.searchParams.append("limit", "1000");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      Authorization: `Bearer ${authToken}`,
    } as Record<string, string>,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}
