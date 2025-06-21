import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineExplorer } from "./components/engine-explorer";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return <EngineExplorer authToken={authToken} instanceUrl={instance.url} />;
}
