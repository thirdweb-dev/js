import { redirect } from "next/navigation";
import { getLastVisitedTeam } from "@/api/team";

export default async function TeamRootPage() {
  const team = await getLastVisitedTeam();
  redirect(team ? `/team/${team.slug}` : "/team/~");
}
