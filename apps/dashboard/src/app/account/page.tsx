import { getTeams } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { redirect } from "next/navigation";
import { AccountTeamsUI } from "./overview/AccountTeamsUI";
import { getAccount } from "./settings/getAccount";

export default async function Page() {
  const account = await getAccount();

  if (!account) {
    redirect("/login?next=/account");
  }

  const teams = await getTeams();

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
