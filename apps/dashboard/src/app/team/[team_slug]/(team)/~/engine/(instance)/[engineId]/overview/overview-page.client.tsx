"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineOverview } from "./components/engine-overview";

export function EngineOverviewPage(props: {
  engineId: string;
  teamSlug: string;
  account: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      content={(res) => (
        <EngineOverview
          instance={res.instance}
          teamSlug={props.teamSlug}
          authToken={props.authToken}
        />
      )}
      teamSlug={props.teamSlug}
      twAccount={props.account}
      authToken={props.authToken}
    />
  );
}
