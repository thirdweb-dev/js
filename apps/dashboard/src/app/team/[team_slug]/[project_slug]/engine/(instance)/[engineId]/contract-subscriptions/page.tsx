"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineContractSubscriptions } from "./components/engine-contract-subscription";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;

  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => (
        <EngineContractSubscriptions instanceUrl={res.instance.url} />
      )}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
