import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { loginRedirect } from "@/utils/redirects";
import { getEngineInstances } from "../_utils/getEngineInstances";
import { EngineInstancesList } from "./overview/engine-list";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: Promise<{
    importUrl?: string;
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  if (searchParams.importUrl) {
    redirect(
      `/team/${params.team_slug}/${params.project_slug}/engine/dedicated/import?importUrl=${searchParams.importUrl}`,
    );
  }

  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/engine/dedicated`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  const res = await getEngineInstances({
    authToken,
    teamIdOrSlug: params.team_slug,
  });

  return (
    <EngineInstancesList
      instances={res.data || []}
      projectSlug={params.project_slug}
      team={team}
    />
  );
}
