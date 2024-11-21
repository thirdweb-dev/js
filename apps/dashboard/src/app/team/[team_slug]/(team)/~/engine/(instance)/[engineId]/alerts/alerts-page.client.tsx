"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAlertsPage } from "./components/EngineAlertsPage";

export default function EngineAlertsPageWithLayout(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => <EngineAlertsPage instance={res.instance} />}
    />
  );
}
