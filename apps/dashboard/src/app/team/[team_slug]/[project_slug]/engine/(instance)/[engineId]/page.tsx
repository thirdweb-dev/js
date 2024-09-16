"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineOverview } from "components/engine/overview/engine-overview";
import type { EngineInstancePageProps } from "./types";

export default function Page(props: EngineInstancePageProps) {
  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineOverview instanceUrl={res.instance.url} />}
      rootPath={`/team/${props.params.team_slug}/${props.params.project_slug}/engine`}
    />
  );
}
