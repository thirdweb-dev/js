import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { TeamHeaderLoggedOut } from "./TeamHeaderLoggedOut";
import { TeamHeaderLoggedIn } from "./team-header-logged-in.client";

export async function TeamHeader() {
  const authToken = await getAuthToken();

  if (!authToken) {
    return <TeamHeaderLoggedOut />;
  }

  const teams = await getTeams();

  if (!teams) {
    return <TeamHeaderLoggedOut />;
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const firstTeam = teams[0];
  if (!firstTeam) {
    return <TeamHeaderLoggedOut />;
  }

  return (
    <TeamHeaderLoggedIn
      currentTeam={firstTeam}
      teamsAndProjects={teamsAndProjects}
      currentProject={undefined}
    />
  );
}
