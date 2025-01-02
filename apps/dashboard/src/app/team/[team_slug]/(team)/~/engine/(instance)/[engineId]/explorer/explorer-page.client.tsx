"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineExplorer } from "./components/engine-explorer";

export function EngineExplorerPage(props: {
  engineId: string;
  team_slug: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      content={(res) => (
        <EngineExplorer
          instanceUrl={res.instance.url}
          authToken={props.authToken}
        />
      )}
      teamSlug={props.team_slug}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
