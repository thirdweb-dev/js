"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineExplorer } from "components/engine/explorer/engine-explorer";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineExplorer instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
