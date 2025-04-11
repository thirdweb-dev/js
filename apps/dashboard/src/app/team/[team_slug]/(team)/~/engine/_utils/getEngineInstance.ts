import { API_SERVER_URL } from "@/constants/env";
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
      url: process.env.NEXT_PUBLIC_DEMO_ENGINE_URL || "",
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
    `${API_SERVER_URL}/v1/teams/${params.teamIdOrSlug}/engine/${params.engineId}`,
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

  return json.result;
}
