import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineSystemMetrics } from "./components/EngineSystemMetrics";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return (
    <EngineSystemMetrics
      authToken={authToken}
      instance={instance}
      projectSlug={params.project_slug}
      teamSlug={params.team_slug}
    />
  );
}
