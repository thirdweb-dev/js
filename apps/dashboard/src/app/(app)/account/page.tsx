import { notFound } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import { getTeams } from "@/api/team/get-team";
import { getMemberByAccountId } from "@/api/team/team-members";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { AccountTeamsUI } from "./overview/AccountTeamsUI";
import { RewindModalClient } from "./rewind/RewindModalClient";

export default async function Page() {
  const [authToken, account, teams] = await Promise.all([
    getAuthToken(),
    getValidAccount("/account"),
    getTeams(),
  ]);

  if (!authToken || !teams) {
    loginRedirect("/account");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  const teamsWithRole = await Promise.all(
    teams.map(async (team) => {
      const member = await getMemberByAccountId(team.slug, account.id);

      if (!member) {
        notFound();
      }

      return {
        role: member.role,
        team,
      };
    }),
  );

  return (
    <div className="flex grow flex-col">
      <header className="border-border border-b py-10">
        <div className="container max-w-[950px]">
          <h1 className="font-semibold text-3xl tracking-tight">Overview</h1>
        </div>
      </header>

      <div className="container flex max-w-[950px] grow flex-col py-8">
        <AccountTeamsUI client={client} teamsWithRole={teamsWithRole} />
      </div>

      <RewindModalClient />
    </div>
  );
}
