import { API_SERVER_URL } from "@/constants/env";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";

export async function getEngineInstances(params: {
  authToken: string;
  teamIdOrSlug: string;
}) {
  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${params.teamIdOrSlug}/engine`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
      },
    },
  );

  if (!res.ok) {
    const errorMessage = await res.text();
    console.error("failed to fetch engine instances");
    console.error(errorMessage);
    return {
      error: errorMessage,
    };
  }

  const json = (await res.json()) as {
    result: EngineInstance[];
  };

  return {
    data: json.result,
  };
}
