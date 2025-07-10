import type { WalletUser } from "thirdweb/wallets";
import { THIRDWEB_EWS_API_HOST } from "@/constants/urls";
import type { SearchType } from "./types";

export async function searchUsers(
  authToken: string,
  clientId: string | undefined,
  ecosystemSlug: string | undefined,
  teamId: string,
  searchType: SearchType,
  query: string,
): Promise<WalletUser[]> {
  const url = new URL(`${THIRDWEB_EWS_API_HOST}/api/2024-05-05/account/list`);

  // Add clientId or ecosystemSlug parameter
  if (ecosystemSlug) {
    url.searchParams.append("ecosystemSlug", ecosystemSlug);
  } else if (clientId) {
    url.searchParams.append("clientId", clientId);
  }

  // Add search parameter based on search type
  switch (searchType) {
    case "email":
      url.searchParams.append("email", query);
      break;
    case "phone":
      url.searchParams.append("phone", query);
      break;
    case "id":
      url.searchParams.append("id", query);
      break;
    case "address":
      url.searchParams.append("address", query);
      break;
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-team-id": teamId.replace("team_", ""),
      ...(clientId && { "x-client-id": clientId }),
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to search users: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.users as WalletUser[];
}
