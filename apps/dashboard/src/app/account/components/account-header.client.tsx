"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { AccountHeader } from "./AccountHeader";

// Remove this file when AppShell is deleted

export function AccountHeaderClient() {
  const accountQuery = useAccount();
  const teamsQuery = useQuery({
    queryKey: ["teams", accountQuery.data?.id],
    queryFn: () => getTeamsClient(),
  });

  const teamsAndProjectsQuery = useQuery({
    queryKey: [teamsQuery.data?.[0]?.slug, "projects"],
    queryFn: async () => {
      const teams = teamsQuery.data;
      if (!teams) {
        throw new Error("No teams");
      }

      const teamsAndProjects = await Promise.all(
        teams.map(async (team) => ({
          team,
          projects: await getProjectsForTeamClient(team.slug),
        })),
      );

      return teamsAndProjects;
    },
    enabled: !!teamsQuery.data,
  });

  return <AccountHeader teamsAndProjects={teamsAndProjectsQuery.data || []} />;
}

async function getTeamsClient() {
  const res = await fetch("/api/server-proxy/api/v1/teams");
  if (res.ok) {
    return (await res.json()).result as Team[];
  }
  throw new Error("Failed to fetch teams");
}

async function getProjectsForTeamClient(teamSlug: string) {
  const res = await fetch(
    `/api/server-proxy/api/v1/teams/${teamSlug}/projects`,
  );
  if (res.ok) {
    return (await res.json()).result as Project[];
  }
  throw new Error("Failed to fetch projects");
}
