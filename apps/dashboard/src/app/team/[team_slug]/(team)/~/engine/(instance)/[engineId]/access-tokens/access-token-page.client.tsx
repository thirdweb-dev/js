"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAccessTokens } from "./components/engine-access-tokens";

export function EngineAccessTokensPage(props: {
  team_slug: string;
  engineId: string;
  authToken: string;
  twAccount: Account;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => (
        <EngineAccessTokens
          instanceUrl={res.instance.url}
          authToken={props.authToken}
        />
      )}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
