import type { EngineInstancePageProps } from "../types";
import { EngineWebhooksPage } from "./webhooks-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <EngineWebhooksPage
      team_slug={params.team_slug}
      engineId={params.engineId}
    />
  );
}
