"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineAccessTokens } from "components/engine/permissions/engine-access-tokens";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineAccessTokens instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
