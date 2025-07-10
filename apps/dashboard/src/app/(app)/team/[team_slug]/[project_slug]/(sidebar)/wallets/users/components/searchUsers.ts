import type { WalletUser } from "thirdweb/wallets";
import { THIRDWEB_EWS_API_HOST } from "@/constants/urls";
import type { SearchType } from "./types";

export async function searchUsers(
  authToken: string,
  clientId: string,
  searchType: SearchType,
  query: string,
): Promise<WalletUser[]> {
  const url = new URL(`${THIRDWEB_EWS_API_HOST}/api/2024-05-05/account/list`);
  
  // Add clientId parameter
  url.searchParams.append("clientId", clientId);
  
  // Add filter parameter as JSON string
  const filter = {
    field: searchType === "address" ? "walletAddress" : searchType,
    value: query,
  };
  url.searchParams.append("filter", JSON.stringify(filter));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": clientId,
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
