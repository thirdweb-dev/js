import type { EngineInstancePageProps } from "../types";
import { EngineExplorerPage } from "./explorer-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineExplorerPage
      engineId={params.engineId}
      team_slug={params.team_slug}
    />
  );
}
