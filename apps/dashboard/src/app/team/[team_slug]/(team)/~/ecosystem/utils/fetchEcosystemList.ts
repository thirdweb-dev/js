import { API_SERVER_URL } from "@/constants/env";
import type { Ecosystem } from "../types";

export async function fetchEcosystemList(authToken: string) {
  const res = await fetch(`${API_SERVER_URL}/v1/ecosystem-wallet/list`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
  }

  const data = (await res.json()) as { result: Ecosystem[] };
  return data.result;
}
