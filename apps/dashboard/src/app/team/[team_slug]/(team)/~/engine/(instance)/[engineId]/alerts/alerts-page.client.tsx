"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAlertsPage } from "./components/EngineAlertsPage";

export default function EngineAlertsPageWithLayout(props: {
  team_slug: string;
  engineId: string;
  twAccount: Account;
  authToken: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => <EngineAlertsPage instance={res.instance} />}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
