import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineContractSubscriptions } from "./components/engine-contract-subscription";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    teamSlug: params.team_slug,
  });

  return (
    <EngineContractSubscriptions
      instanceUrl={instance.url}
      authToken={authToken}
    />
  );
}
