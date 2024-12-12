import { getProject } from "@/api/projects";
import { notFound, redirect } from "next/navigation";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { fetchBlueprintSpec } from "../utils";
import { BlueprintPlayground } from "./blueprint-playground.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    blueprint_slug: string;
  }>;
  searchParams: Promise<{ path: string }>;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    props.searchParams,
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/insight/${params.blueprint_slug}?path=${searchParams.path}`,
    );
  }

  // invalid url
  if (!searchParams.path) {
    redirect(`/team/${params.team_slug}/${params.project_slug}/insight`);
  }

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    return redirect(`/team/${params.team_slug}`);
  }

  const [blueprintSpec, apiKey] = await Promise.all([
    fetchBlueprintSpec({
      authToken,
      blueprintId: params.blueprint_slug,
    }),
    getAPIKeyForProjectId(project.id),
  ]);

  // unexpected error - should never happen
  if (!apiKey) {
    console.error("Failed to get API key for project", {
      projectId: project.id,
      teamSlug: params.team_slug,
      projectSlug: params.project_slug,
    });
    notFound();
  }

  const pathMetadata = blueprintSpec.openapiJson.paths[searchParams.path]?.get;

  // invalid url
  if (!pathMetadata) {
    redirect(`/team/${params.team_slug}/${params.project_slug}/insight`);
  }

  const isInsightEnabled = !!apiKey.services?.find((s) => s.name === "insight");

  const supportedChainIds =
    blueprintSpec.openapiJson.servers[0]?.variables.chainId.enum.map(Number) ||
    [];

  return (
    <BlueprintPlayground
      metadata={pathMetadata}
      backLink={`/team/${params.team_slug}/${params.project_slug}/insight`}
      clientId={project.publishableKey}
      path={searchParams.path}
      isInsightEnabled={isInsightEnabled}
      projectSettingsLink={`/team/${params.team_slug}/${params.project_slug}/settings`}
      supportedChainIds={supportedChainIds}
      authToken={authToken}
    />
  );
}
