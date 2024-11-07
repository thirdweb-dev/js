"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineWebhooks } from "./components/engine-webhooks";

export function EngineWebhooksPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      content={(res) => <EngineWebhooks instanceUrl={res.instance.url} />}
      engineId={props.engineId}
      teamSlug={props.team_slug}
    />
  );
}
