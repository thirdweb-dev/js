import {
  NEXT_PUBLIC_DEMO_ENGINE_URL,
  NEXT_PUBLIC_THIRDWEB_API_HOST,
} from "@/constants/public-envs";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";

export async function getEngineInstance(params: {
  teamIdOrSlug: string;
  authToken: string;
  engineId: string;
  accountId: string;
}) {
  if (params.engineId === "sandbox") {
    const sandboxEngine: EngineInstance = {
      id: "sandbox",
      url: NEXT_PUBLIC_DEMO_ENGINE_URL,
      name: "Demo Engine",
      status: "active",
      lastAccessedAt: new Date().toISOString(),
      accountId: params.accountId,
      isCloudHosted: false,
      isPlanEngine: false,
    };

    return sandboxEngine;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${params.teamIdOrSlug}/engine/${params.engineId}`,
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
    return undefined;
  }

  const json = (await res.json()) as {
    result: EngineInstance;
  };

  if (!json.result.url.endsWith("/")) {
    json.result.url += "/";
  }

  return json.result;
}
