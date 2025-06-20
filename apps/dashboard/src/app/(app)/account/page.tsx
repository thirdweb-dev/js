import { notFound } from "next/navigation";
import { getTeams } from "@/api/team";
import { getMemberByAccountId } from "@/api/team-members";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../api/lib/getAuthToken";
import { loginRedirect } from "../login/loginRedirect";
import { AccountTeamsUI } from "./overview/AccountTeamsUI";
import { getValidAccount } from "./settings/getAccount";

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
    </div>
  );
}
