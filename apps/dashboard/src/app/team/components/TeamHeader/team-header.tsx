import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { cookies } from "next/headers";
import { getThirdwebClient } from "../../../../@/constants/thirdweb.server";
import { LAST_USED_TEAM_ID } from "../../../../constants/cookies";
import { getRawAccount } from "../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../api/lib/getAuthToken";
import { HeaderLoggedOut } from "../HeaderLoggedOut/HeaderLoggedOut";
import { TeamHeaderLoggedIn } from "./team-header-logged-in.client";

export async function TeamHeader() {
  const [account, teams, accountAddress, authToken] = await Promise.all([
    getRawAccount(),
    getTeams(),
    getAuthTokenWalletAddress(),
    getAuthToken(),
  ]);

  if (!account || !accountAddress || !teams) {
    return <HeaderLoggedOut />;
  }

  const cookiesObj = await cookies();
  const lastUsedTeamId = cookiesObj.get(LAST_USED_TEAM_ID)?.value;
  const lastUsedTeam = teams.find((team) => team.id === lastUsedTeamId);

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const firstTeam = teams[0];
  const selectedTeam = lastUsedTeam || firstTeam;

  if (!selectedTeam) {
    return <HeaderLoggedOut />;
  }

  const client = getThirdwebClient({
    jwt: authToken,
    teamId: lastUsedTeam?.id,
  });

  return (
    <TeamHeaderLoggedIn
      client={client}
      currentTeam={selectedTeam}
      teamsAndProjects={teamsAndProjects}
      currentProject={undefined}
      account={account}
      accountAddress={accountAddress}
    />
  );
}
