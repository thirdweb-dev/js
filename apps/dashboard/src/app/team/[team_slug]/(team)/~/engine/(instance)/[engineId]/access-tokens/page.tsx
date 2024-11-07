import type { EngineInstancePageProps } from "../types";
import { EngineAccessTokensPage } from "./access-token-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineAccessTokensPage
      team_slug={params.team_slug}
      engineId={params.engineId}
    />
  );
}
