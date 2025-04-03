import { isProjectActive } from "@/api/analytics";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { NebulaAnalyticsPage } from "./components/analytics/nebula-analytics-page";
import { NebulaWaitListPage } from "./components/nebula-waitlist-page";
import { NebulaFTUX } from "./nebula-ftux";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: Promise<{
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/nebula`);
  }

  const hasNebulaAccess = team.enabledScopes.includes("nebula");

  const activeResponse = await isProjectActive({
    teamId: team.id,
    projectId: project.id,
  });

  const showFTUX = !activeResponse.nebula;

  if (hasNebulaAccess) {
    if (showFTUX) {
      return (
        <div className="flex grow flex-col">
          <div className="border-b py-10">
            <div className="container max-w-7xl">
              <h1 className="font-semibold text-3xl tracking-tight">Nebula</h1>
            </div>
          </div>

          <div className="container mt-6 max-w-7xl">
            <NebulaFTUX
              secretKeyMasked={project.secretKeys[0]?.masked || ""}
              projectId={project.id}
            />
          </div>
        </div>
      );
    }

    return (
      <NebulaAnalyticsPage
        teamId={team.id}
        authToken={authToken}
        searchParams={searchParams}
        projectId={project.id}
      />
    );
  }

  return <NebulaWaitListPage team={team} />;
}
