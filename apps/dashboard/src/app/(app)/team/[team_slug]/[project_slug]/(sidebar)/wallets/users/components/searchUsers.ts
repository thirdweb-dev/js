import type { SearchParams, SearchType, UserSearchResult } from "./types";

export async function searchUsers(
  authToken: string,
  searchType: SearchType,
  query: string,
): Promise<UserSearchResult[]> {
  const url = new URL(
    "https://in-app-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details",
  );

  // Map search type to query parameter
  const queryByMap: Record<SearchType, string> = {
    email: "email",
    phone: "phone",
    id: "id",
    address: "walletAddress",
  };

  const queryBy = queryByMap[searchType];
  url.searchParams.append("queryBy", queryBy);
  url.searchParams.append(queryBy, query);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to search users: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data as UserSearchResult[];
}
