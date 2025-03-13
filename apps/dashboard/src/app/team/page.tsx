import { getDefaultTeam } from "@/api/team";
import { notFound, redirect } from "next/navigation";

export default async function TeamRootPage() {
  const firstTeam = await getDefaultTeam();
  if (!firstTeam) {
    notFound();
  }
  redirect(`/team/${firstTeam.slug}`);
}
