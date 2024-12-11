"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineWebhooks } from "./components/engine-webhooks";

export function EngineWebhooksPage(props: {
  team_slug: string;
  engineId: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      content={(res) => (
        <EngineWebhooks
          instanceUrl={res.instance.url}
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
