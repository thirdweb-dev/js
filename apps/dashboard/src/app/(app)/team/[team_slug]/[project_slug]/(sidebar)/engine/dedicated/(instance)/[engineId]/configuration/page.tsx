import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineConfiguration } from "./components/engine-configuration";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return (
    <EngineConfiguration
      authToken={authToken}
      instance={instance}
      projectSlug={params.project_slug}
      teamSlug={params.team_slug}
    />
  );
}
