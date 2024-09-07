"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineConfiguration } from "components/engine/configuration/engine-configuration";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineConfiguration instance={res.instance} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
