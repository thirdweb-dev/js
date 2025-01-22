import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  bannedAt: Date | null;
  domains: string[];
  bundleIds: string[];
  redirectUrls: string[];
  lastAccessedAt: Date | null;
  slug: string;
  teamId: string;
  publishableKey: string;
  // image: string; // TODO
};

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
