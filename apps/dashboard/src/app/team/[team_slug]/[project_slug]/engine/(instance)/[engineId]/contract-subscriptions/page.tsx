import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineContractSubscriptions } from "./components/engine-contract-subscription";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => (
        <EngineContractSubscriptions instanceUrl={res.instance.url} />
      )}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
