"use client";

import { WithEngineInstance } from "../_components/EnginePageLayout";
import { EngineAccessTokens } from "./components/engine-access-tokens";

export function EngineAccessTokensPage(props: {
  team_slug: string;
  engineId: string;
}) {
  return (
    <WithEngineInstance
      engineId={props.engineId}
      teamSlug={props.team_slug}
      content={(res) => <EngineAccessTokens instanceUrl={res.instance.url} />}
    />
  );
}
