import type { Ecosystem, Partner } from "@/api/ecosystems";

export async function fetchPartnerDetails(args: {
  authToken: string;
  ecosystem: Ecosystem;
  partnerId: string;
  teamId: string;
}): Promise<Partner> {
  const { authToken, ecosystem, partnerId, teamId } = args;

  try {
    const response = await fetch(
      `${ecosystem.url}/${ecosystem.id}/partner/${partnerId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-thirdweb-team-id": teamId,
        },
        method: "GET",
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
