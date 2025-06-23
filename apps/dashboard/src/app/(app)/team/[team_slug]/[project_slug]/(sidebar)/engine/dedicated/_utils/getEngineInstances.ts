import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { EngineInstance } from "@/hooks/useEngine";

export async function getEngineInstances(params: {
  authToken: string;
  teamIdOrSlug: string;
}) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamIdOrSlug}/engine`,
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
