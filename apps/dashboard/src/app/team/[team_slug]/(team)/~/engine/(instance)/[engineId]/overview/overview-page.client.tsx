"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineOverview } from "./components/engine-overview";

export function EngineOverviewPage(props: {
  engineId: string;
  team_slug: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      content={(res) => (
        <EngineOverview instance={res.instance} teamSlug={props.team_slug} />
      )}
      teamSlug={props.team_slug}
    />
  );
}
