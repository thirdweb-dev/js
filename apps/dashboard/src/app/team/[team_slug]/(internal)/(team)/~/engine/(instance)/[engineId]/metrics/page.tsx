import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineSystemMetrics } from "./components/EngineSystemMetrics";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    teamSlug: params.team_slug,
  });

  return (
    <EngineSystemMetrics
      instance={instance}
      teamSlug={params.team_slug}
      authToken={authToken}
    />
  );
}
