"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineConfiguration } from "./components/engine-configuration";

export function EngineConfigurationPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      content={(res) => (
        <EngineConfiguration
          instance={res.instance}
          teamSlug={props.team_slug}
        />
      )}
      engineId={props.engineId}
      teamSlug={props.team_slug}
    />
  );
}
