"use client";;
import { use } from "react";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineOverview } from "components/engine/overview/engine-overview";
import type { EngineInstancePageProps } from "./types";

export default function Page(props: EngineInstancePageProps) {
  const params = use(props.params);
  return (
    (<WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineOverview instance={res.instance} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />)
  );
}
