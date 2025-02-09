import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { unstable_cache } from "next/cache";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { projectsCacheTag } from "../constants/cacheTags";

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

  const getCachedProjects = unstable_cache(
    getProjectsForAuthToken,
    ["getProjects"],
    {
      tags: [projectsCacheTag(token)],
      revalidate: 3600, // 1 hour
    },
  );

  return getCachedProjects(token, teamSlug);
}

export async function getProjectsForAuthToken(
  authToken: string,
  teamSlug: string,
) {
  console.log("FETCHING PROJECTS ------------------------");
  const res = await fetch(`${API_SERVER_URL}/v1/teams/${teamSlug}/projects`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (res.ok) {
    return (await res.json())?.result as Project[];
  }
  return [];
}

export async function getProject(teamSlug: string, projectSlug: string) {
  const authToken = await getAuthToken();

  if (!authToken) {
    return null;
  }

  const getCachedProject = unstable_cache(
    getProjectForAuthToken,
    ["getProject"],
    {
      tags: [projectsCacheTag(authToken)],
      revalidate: 3600, // 1 hour
    },
  );

  return getCachedProject(authToken, teamSlug, projectSlug);
}

async function getProjectForAuthToken(
  authToken: string,
  teamSlug: string,
  projectSlug: string,
) {
  console.log(
    "FETCHING PROJECT ------------------------",
    teamSlug,
    projectSlug,
  );
  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${teamSlug}/projects/${projectSlug}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (res.ok) {
    return (await res.json())?.result as Project;
  }
  return null;
}
