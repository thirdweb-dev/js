import { EngineOverviewPage } from "./overview/overview-page.client";
import type { EngineInstancePageProps } from "./types";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineOverviewPage
      engineId={params.engineId}
      teamSlug={params.team_slug}
    />
  );
}
