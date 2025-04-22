import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";

export type Project = ProjectResponse;

export async function getProjects(teamSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return [];
  }

  const teamsRes = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamSlug}/projects`,
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
    `${API_SERVER_URL}/v1/teams/${teamSlug}/projects/${projectSlug}`,
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
