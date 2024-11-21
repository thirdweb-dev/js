import type { EngineInstancePageProps } from "../types";
import EngineAlertsPageWithLayout from "./alerts-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <EngineAlertsPageWithLayout
      engineId={params.engineId}
      team_slug={params.team_slug}
    />
  );
}
