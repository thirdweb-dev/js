import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineConfiguration } from "./components/engine-configuration";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    teamSlug: params.team_slug,
  });

  return (
    <EngineConfiguration
      instance={instance}
      teamSlug={params.team_slug}
      authToken={authToken}
    />
  );
}
