"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAdmins } from "./components/engine-admins";

export function EngineAdminsPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => <EngineAdmins instanceUrl={res.instance.url} />}
    />
  );
}
