"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineRelayer } from "./components/engine-relayer";

export function EngineRelayersPage(props: {
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
        <EngineRelayer
          instanceUrl={res.instance.url}
          authToken={props.authToken}
        />
      )}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
