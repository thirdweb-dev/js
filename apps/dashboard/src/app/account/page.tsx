import { getTeams } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { loginRedirect } from "../login/loginRedirect";
import { AccountTeamsUI } from "./overview/AccountTeamsUI";
import { getValidAccount } from "./settings/getAccount";

export default async function Page() {
  const account = await getValidAccount("/account");
  const teams = await getTeams();
  if (!teams) {
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
    <div className="container grow py-8">
      <AccountTeamsUI
        teamsWithRole={teamsWithRole}
        client={getThirdwebClient()}
      />
    </div>
  );
}
