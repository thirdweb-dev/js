import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineConfiguration } from "./components/engine-configuration";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineConfiguration instance={res.instance} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
