"use server";
import assert from "node:assert";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/env";

export async function createNebulaSesssion(args: {
  chainId: number;
  address: string;
}): Promise<string> {
  try {
    const { NEXT_PUBLIC_NEBULA_URL } = process.env;
    assert(NEXT_PUBLIC_NEBULA_URL, "NEXT_PUBLIC_NEBULA_URL is not set");
    const { chainId, address } = args;

    const response = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DASHBOARD_THIRDWEB_SECRET_KEY}`,
      },
      body: JSON.stringify({
        title: `Wallet Overview - ${chainId}:${address}`,
        context_filter: {
          chainIds: [chainId],
          walletAddresses: [address],
        },
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Unexpected status ${response.status}: ${await response.text()}`,
      );
    }

    const data = await response.json();
    return data.result.id;
  } catch (error) {
    console.error("Error creating Nebula session:", error);
    throw error;
  }
}
