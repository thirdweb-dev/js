import { API_SERVER_URL } from "@/constants/env";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { getAuthToken } from "./getAuthToken";

// TODO - Fix the `/v1/keys/${apiKeyId}` endpoint in API server

async function getAPIKey(apiKeyId: string) {
  // The `/v1/keys/${apiKeyId}`; does not return the "FULL" ApiKey object for some reason
  // Until this is fixed in API server - we just use the getApiKeys() and find the key by id

  const apiKeys = await getApiKeys();
  return apiKeys.find((key) => key.id === apiKeyId);

  // const authToken = getAuthToken();
  // const apiServerURL = new URL(
  //   process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com",
  // );

  // apiServerURL.pathname = `/v1/keys/${apiKeyId}`;

  // const res = await fetch(apiServerURL, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${authToken}`,
  //   },
  // });

  // const json = await res.json();

  // if (json.error) {
  //   console.error(json.error);
  //   return undefined;
  // }

  // return json.data as ApiKey;
}

async function getApiKeys() {
  const authToken = await getAuthToken();

  const res = await fetch(`${API_SERVER_URL}/v1/keys`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  const json = await res.json();

  if (json.error) {
    return [];
  }

  return json.data as ApiKey[];
}

export function getAPIKeyForProjectId(projectId: string) {
  if (projectId.startsWith("prj_")) {
    return getAPIKey(projectId.slice("prj_".length));
  }

  return getAPIKey(projectId);
}
