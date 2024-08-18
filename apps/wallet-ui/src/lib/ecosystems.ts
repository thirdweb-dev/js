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
    response.body?.cancel();
    throw new Error("Failed to fetch ecosystem info");
  }

  const data = await response.json();

  return data;
}
