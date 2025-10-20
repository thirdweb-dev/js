"use server";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { getAuthToken } from "@/api/auth-token";
import { UB_BASE_URL } from "./constants";
import type { TokenMetadata } from "./types";

export async function addUniversalBridgeTokenRoute(props: {
  chainId: number;
  tokenAddress: string;
  project: ProjectResponse;
}) {
  const authToken = await getAuthToken();
  const url = new URL(`${UB_BASE_URL}/v1/tokens`);

  const res = await fetch(url.toString(), {
    body: JSON.stringify({
      chainId: props.chainId,
      tokenAddress: props.tokenAddress,
    }),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.project.publishableKey,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}
