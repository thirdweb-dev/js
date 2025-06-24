"use server";
import "server-only";

import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";

    export type WebhookConfig = {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        teamId: string;
        projectId: string;
        destinationUrl: string;
        pausedAt: Date | null;
        webhookSecret: string;
    }

export async function getWebhookConfigs(
  teamIdOrSlug: string,
  projectIdOrSlug: string,
): Promise< {data: WebhookConfig[] } |  {error: string}> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "Unauthorized." }
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/projects/${projectIdOrSlug}/webhook-configs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  try {
    const json = (await res.json()) as { data: WebhookConfig[],
        error: { message: string};
     };
     if (json.error) {
        return { error: json.error.message }
     }
     return { data: json.data }
  } catch (e) {
    return { error: "Failed to fetch webhooks." }
  }
}
