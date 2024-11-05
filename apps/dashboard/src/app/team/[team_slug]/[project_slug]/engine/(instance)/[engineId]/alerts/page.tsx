import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineAlertsPage } from "./components/EngineAlertsPage";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineAlertsPage instance={res.instance} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
