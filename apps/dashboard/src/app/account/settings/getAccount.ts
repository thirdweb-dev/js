import { API_SERVER_URL } from "@/constants/env";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { getAuthToken } from "../../api/lib/getAuthToken";

export async function getAccount() {
  const authToken = getAuthToken();
  const apiServerURL = new URL(API_SERVER_URL);

  apiServerURL.pathname = "/v1/account/me";

  const res = await fetch(apiServerURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const json = await res.json();

  if (json.error) {
    console.error(json.error);
    return undefined;
  }

  return json.data as Account;
}
