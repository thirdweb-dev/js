import { engineInstancePageHandler } from "../../_utils/getEngineInstancePageMeta";
import { EngineOverview } from "./overview/components/engine-overview";
import type { EngineInstancePageProps } from "./types";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken, client } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return (
    <EngineOverview
      authToken={authToken}
      client={client}
      instance={instance}
      projectSlug={params.project_slug}
      teamSlug={params.team_slug}
    />
  );
}
