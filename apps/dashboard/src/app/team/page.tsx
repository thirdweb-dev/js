import { getTeams } from "@/api/team";
import { notFound, redirect } from "next/navigation";

export default async function TeamRootPage() {
  // get all teams, then go to the first team
  const teams = await getTeams();

  const firstTeam = teams?.[0];
  if (!firstTeam) {
    notFound();
  }
  redirect(`/team/${firstTeam.slug}`);
}
