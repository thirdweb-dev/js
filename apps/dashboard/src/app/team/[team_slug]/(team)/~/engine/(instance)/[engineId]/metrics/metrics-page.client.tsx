"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineSystemMetrics } from "./components/EngineSystemMetrics";

export function EngineMetricsPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => (
        <EngineSystemMetrics
          instance={res.instance}
          teamSlug={props.team_slug}
        />
      )}
    />
  );
}
