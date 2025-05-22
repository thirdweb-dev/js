import { getLastVisitedTeam } from "@/api/team";
import { redirect } from "next/navigation";

export default async function TeamRootPage() {
  const team = await getLastVisitedTeam();
  redirect(team ? `/team/${team.slug}` : "/team/~");
}
