"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineExplorer } from "./components/engine-explorer";

export function EngineExplorerPage(props: {
  engineId: string;
  team_slug: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      content={(res) => <EngineExplorer instanceUrl={res.instance.url} />}
      teamSlug={props.team_slug}
    />
  );
}
