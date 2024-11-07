"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineContractSubscriptions } from "./components/engine-contract-subscription";

export function EngineContractSubscriptionsPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => (
        <EngineContractSubscriptions instanceUrl={res.instance.url} />
      )}
    />
  );
}
