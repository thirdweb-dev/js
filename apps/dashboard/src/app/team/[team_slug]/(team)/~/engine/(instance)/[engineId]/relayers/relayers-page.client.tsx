"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineRelayer } from "./components/engine-relayer";

export function EngineRelayersPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => <EngineRelayer instanceUrl={res.instance.url} />}
    />
  );
}
