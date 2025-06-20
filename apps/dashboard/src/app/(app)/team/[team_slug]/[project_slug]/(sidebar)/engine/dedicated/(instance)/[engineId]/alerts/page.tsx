import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineAlertsPage } from "./components/EngineAlertsPage";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return (
    <EngineAlertsPage instance={instance} teamIdOrSlug={params.team_slug} />
  );
}
