"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineSystemMetrics } from "./components/EngineSystemMetrics";

export function EngineMetricsPage(props: {
  team_slug: string;
  engineId: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => (
        <EngineSystemMetrics
          instance={res.instance}
          teamSlug={props.team_slug}
          authToken={props.authToken}
        />
      )}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
