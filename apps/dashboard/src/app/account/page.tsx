import { getTeams } from "@/api/team";
import { AccountTeamsUI } from "./overview/AccountTeamsUI";

export default async function Page() {
  const teams = await getTeams();

  const teamsWithRole = teams.map((team) => ({
    team,
    // TODO fetch the role of current user in this team
    role: "MEMBER" as const, // THIS IS A PLACEHOLDER !!!
  }));

  return (
    <div className="grow">
      <AccountTeamsUI teamsWithRole={teamsWithRole} />
    </div>
  );
}
