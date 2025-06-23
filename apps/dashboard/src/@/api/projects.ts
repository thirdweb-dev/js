import "server-only";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";

export type Project = ProjectResponse;

export async function getProjects(teamSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return [];
  }

  const teamsRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamSlug}/projects`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as Project[];
  }
  return [];
}

export async function getProject(teamSlug: string, projectSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const teamsRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamSlug}/projects/${projectSlug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (teamsRes.ok) {
    return (await teamsRes.json())?.result as Project;
  }
  return null;
}
