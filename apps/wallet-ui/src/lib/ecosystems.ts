export async function getEcosystemInfo(ecosystemId: string) {
  const response = await fetch(
    "https://embedded-wallet.thirdweb.com/api/2024-05-05/ecosystem-wallet",
    {
      headers: {
        "x-ecosystem-id": "ecosystem.new.age", // Hardcoded for now
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
