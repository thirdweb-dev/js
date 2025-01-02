"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineContractSubscriptions } from "./components/engine-contract-subscription";

export function EngineContractSubscriptionsPage(props: {
  team_slug: string;
  engineId: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      twAccount={props.twAccount}
      authToken={props.authToken}
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => (
        <EngineContractSubscriptions
          instanceUrl={res.instance.url}
          authToken={props.authToken}
        />
      )}
    />
  );
}
