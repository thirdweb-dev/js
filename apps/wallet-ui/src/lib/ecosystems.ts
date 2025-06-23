import { notFound } from "next/navigation";
import type { Ecosystem } from "@/types/Ecosystem";

export async function getEcosystemInfo(
  ecosystemId: string,
): Promise<Ecosystem> {
  const response = await fetch(
    "https://embedded-wallet.thirdweb.com/api/2024-05-05/ecosystem-wallet",
    {
      headers: {
        "x-ecosystem-id": `ecosystem.${ecosystemId}`,
      },
    },
  );

  if (!response.ok) {
    const errorResult = await response.json();
    if (response.status === 404) {
      console.error(
        `Failed to fetch ecosystem info for ${ecosystemId}: ${errorResult.message}`,
      );
      notFound();
    }
    throw new Error(
      `Failed to fetch ecosystem info for ${ecosystemId}: ${errorResult.message}`,
    );
  }

  const data = await response.json();

  return data;
}
