"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import { EngineAdmins } from "components/engine/permissions/engine-admins";
import type { EngineInstancePageProps } from "../types";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={props.params.engineId}
      content={(res) => <EngineAdmins instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
