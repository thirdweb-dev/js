import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { EngineOverviewPage } from "./overview/overview-page.client";
import type { EngineInstancePageProps } from "./types";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);
  if (!team) {
    redirect("/team");
  }

  return (
    <EngineOverviewPage
      engineId={params.engineId}
      teamSlug={params.team_slug}
      teamId={team.id}
    />
  );
}
