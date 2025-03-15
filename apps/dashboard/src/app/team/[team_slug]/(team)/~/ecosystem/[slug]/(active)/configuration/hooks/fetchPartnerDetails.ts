import type { Ecosystem, Partner } from "../../../../types";

export async function fetchPartnerDetails(args: {
  authToken: string;
  ecosystem: Ecosystem;
  partnerId: string;
}): Promise<Partner> {
  const { authToken, ecosystem, partnerId } = args;

  try {
    const response = await fetch(
      `${ecosystem.url}/${ecosystem.id}/partner/${partnerId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch partner details: ${response.status} - ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching partner:", error);
    throw error;
  }
}
