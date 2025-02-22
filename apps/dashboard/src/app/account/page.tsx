import { getTeams } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { getThirdwebClient } from "@/constants/thirdweb.server";
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

  const teamsWithRole = (
    await Promise.all(
      teams.map(async (team) => {
        const members = await getMembers(team.slug);
        if (!members) {
          return {
            team,
            role: "MEMBER" as const,
          };
        }

        const accountMemberInfo = members.find(
          (m) => m.accountId === account.id,
        );

        return {
          team,
          role: accountMemberInfo?.role || "MEMBER",
        };
      }),
    )
  ).filter((x) => !!x);

  return (
    <div className="flex grow flex-col">
      <header className="border-border border-b py-10">
        <div className="container max-w-[950px]">
          <h1 className="font-semibold text-3xl tracking-tight">Overview</h1>
        </div>
      </header>

      <div className="container flex max-w-[950px] grow flex-col py-8">
        <AccountTeamsUI
          teamsWithRole={teamsWithRole}
          client={getThirdwebClient(authToken)}
        />
      </div>
    </div>
  );
}
