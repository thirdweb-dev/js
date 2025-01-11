"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAdmins } from "./components/engine-admins";

export function EngineAdminsPage(props: {
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
        <EngineAdmins
          instanceUrl={res.instance.url}
          authToken={props.authToken}
        />
      )}
      twAccount={props.twAccount}
      authToken={props.authToken}
    />
  );
}
