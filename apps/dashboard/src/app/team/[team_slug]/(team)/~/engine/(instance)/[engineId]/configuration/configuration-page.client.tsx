"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineConfiguration } from "./components/engine-configuration";

export function EngineConfigurationPage(props: {
  team_slug: string;
  engineId: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      content={(res) => (
        <EngineConfiguration
          instance={res.instance}
          teamSlug={props.team_slug}
          authToken={props.authToken}
        />
      )}
      engineId={props.engineId}
      teamSlug={props.team_slug}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
