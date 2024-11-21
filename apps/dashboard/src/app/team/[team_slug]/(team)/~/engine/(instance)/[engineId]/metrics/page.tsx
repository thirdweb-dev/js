import type { EngineInstancePageProps } from "../types";
import { EngineMetricsPage } from "./metrics-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <EngineMetricsPage
      team_slug={params.team_slug}
      engineId={params.engineId}
    />
  );
}
