import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { getAuthToken } from "./getAuthToken";

export async function getAPIKey(apiKeyId: string) {
  const authToken = getAuthToken();
  const apiServerURL = new URL(
    process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com",
  );

  apiServerURL.pathname = `/v1/keys/${apiKeyId}`;

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

  return json.data as ApiKey;
}
