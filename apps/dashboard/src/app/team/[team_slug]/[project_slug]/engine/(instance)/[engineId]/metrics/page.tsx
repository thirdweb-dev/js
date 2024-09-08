"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineSystemMetrics } from "components/engine/system-metrics";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;

  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineSystemMetrics instance={res.instance} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
