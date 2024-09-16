"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineRelayer } from "components/engine/relayer/engine-relayer";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineRelayer instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
