import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineAdmins } from "./components/engine-admins";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineAdmins instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
