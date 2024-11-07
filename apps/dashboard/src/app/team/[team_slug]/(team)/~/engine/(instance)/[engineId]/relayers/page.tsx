import type { EngineInstancePageProps } from "../types";
import { EngineRelayersPage } from "./relayers-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineRelayersPage
      engineId={params.engineId}
      team_slug={params.team_slug}
    />
  );
}
