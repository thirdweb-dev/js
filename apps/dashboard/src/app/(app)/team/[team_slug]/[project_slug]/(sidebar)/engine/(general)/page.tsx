import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { getEngineInstances } from "../_utils/getEngineInstances";
import { ImportEngineButton } from "./import/import-engine-dialog";
import { DedicatedEngineSubscriptionButton } from "./overview/engine-instances-table";
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
      `/team/${params.team_slug}/${params.project_slug}/engine?importUrl=${searchParams.importUrl}`,
    );
  }

  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/engine`);
  }

  if (!team) {
    redirect("/team");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const res = await getEngineInstances({
    authToken,
    teamIdOrSlug: params.team_slug,
  });

  return (
    <ProjectPage
      header={{
        client,
        title: "Engine",
        description: "Manage your deployed Engine instances.",
        actions: {
          primary: {
            component: <DedicatedEngineSubscriptionButton team={team} />,
          },
          secondary: {
            component: (
              <ImportEngineButton
                prefillImportUrl={searchParams.importUrl}
                teamSlug={params.team_slug}
                projectSlug={params.project_slug}
              />
            ),
          },
        },
      }}
    >
      <EngineInstancesList
        instances={res.data || []}
        projectSlug={params.project_slug}
        team={team}
      />
    </ProjectPage>
  );
}
