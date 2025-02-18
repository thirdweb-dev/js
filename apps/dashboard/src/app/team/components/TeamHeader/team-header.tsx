import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getRawAccount } from "../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { HeaderLoggedOut } from "../HeaderLoggedOut/HeaderLoggedOut";
import { TeamHeaderLoggedIn } from "./team-header-logged-in.client";

export async function TeamHeader() {
  const [account, teams, accountAddress] = await Promise.all([
    getRawAccount(),
    getTeams(),
    getAuthTokenWalletAddress(),
  ]);

  if (!account || !accountAddress || !teams) {
    return <HeaderLoggedOut />;
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const firstTeam = teams[0];
  if (!firstTeam) {
    return <HeaderLoggedOut />;
  }

  return (
    <TeamHeaderLoggedIn
      currentTeam={firstTeam}
      teamsAndProjects={teamsAndProjects}
      currentProject={undefined}
      account={account}
      accountAddress={accountAddress}
    />
  );
}
