import { LAST_USED_TEAM_ID } from "constants/cookies";
import { cookies } from "next/headers";
import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
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

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  if (!account || !accountAddress || !teams) {
    return <HeaderLoggedOut client={client} />;
  }

  const cookiesObj = await cookies();
  const lastUsedTeamId = cookiesObj.get(LAST_USED_TEAM_ID)?.value;
  const lastUsedTeam = teams.find((team) => team.id === lastUsedTeamId);

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  const firstTeam = teams[0];
  const selectedTeam = lastUsedTeam || firstTeam;

  if (!selectedTeam) {
    return <HeaderLoggedOut client={client} />;
  }

  const lastUsedTeamClient = getClientThirdwebClient({
    jwt: authToken,
    teamId: lastUsedTeam?.id,
  });

  return (
    <TeamHeaderLoggedIn
      account={account}
      accountAddress={accountAddress}
      client={lastUsedTeamClient}
      currentProject={undefined}
      currentTeam={selectedTeam}
      teamsAndProjects={teamsAndProjects}
    />
  );
}
