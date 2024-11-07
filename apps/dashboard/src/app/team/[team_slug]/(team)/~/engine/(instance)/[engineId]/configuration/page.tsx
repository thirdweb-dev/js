import type { EngineInstancePageProps } from "../types";
import { EngineConfigurationPage } from "./configuration-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineConfigurationPage
      engineId={params.engineId}
      team_slug={params.team_slug}
    />
  );
}
