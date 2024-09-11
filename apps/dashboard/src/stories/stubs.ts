import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";

export function projectStub(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date(),
    domains: [] as string[],
    id: id,
    updatedAt: new Date(),
    teamId: teamId,
    redirectUrls: [] as string[],
    slug: `project-${id}`,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    lastAccessedAt: null,
    deletedAt: null,
    bannedAt: null,
  };

  return project;
}

export function teamStub(
  id: string,
  billingPlan: "free" | "pro" | "growth",
): Team {
  const team: Team = {
    id: `team-${id}-id`,
    billingPlan: billingPlan,
    billingStatus: "validPayment",
    name: `Team ${id}`,
    slug: `team-${id}`,
    bannedAt: null,
    createdAt: new Date().toISOString(),
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  };

  return team;
}

export const teamsAndProjectsStub: Array<{ team: Team; projects: Project[] }> =
  [
    {
      team: teamStub("1", "free"),
      projects: [
        projectStub("t1p1", "team-1"),
        projectStub("t1p2", "team-1"),
        projectStub("t1p3", "team-1"),
        projectStub("t1p4", "team-1"),
      ],
    },
    {
      team: teamStub("2", "growth"),
      projects: [projectStub("t2p1", "team-2"), projectStub("t2p2", "team-2")],
    },
    {
      team: teamStub("3", "pro"),
      projects: [projectStub("t3p1", "team-3")],
    },
  ];
