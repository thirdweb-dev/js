import { getLastVisitedTeamOrDefaultTeam } from "@/api/team";
import { notFound, redirect } from "next/navigation";

export default async function TeamRootPage() {
  const team = await getLastVisitedTeamOrDefaultTeam();
  if (!team) {
    notFound();
  }
  redirect(`/team/${team.slug}`);
}
