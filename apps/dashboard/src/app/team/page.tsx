import { getTeams } from "@/api/team";
import { redirect } from "next/navigation";

export default async function TeamRootPage() {
  // get all teams, then go to the first team
  const teams = await getTeams();

  const firstTeam = teams[0];
  if (!firstTeam) {
    return redirect("/404");
  }
  redirect(`/team/${firstTeam.slug}`);
}
