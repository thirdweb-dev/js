import type { EngineInstancePageProps } from "../types";
import { EngineContractSubscriptionsPage } from "./contract-subscriptions-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  return (
    <EngineContractSubscriptionsPage
      engineId={params.engineId}
      team_slug={params.team_slug}
    />
  );
}
