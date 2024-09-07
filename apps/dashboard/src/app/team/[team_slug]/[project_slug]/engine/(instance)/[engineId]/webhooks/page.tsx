"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineWebhooks } from "components/engine/configuration/engine-webhooks";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;

  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineWebhooks instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
