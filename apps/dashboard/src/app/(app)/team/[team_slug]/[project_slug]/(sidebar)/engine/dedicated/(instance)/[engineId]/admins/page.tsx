import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineAdmins } from "./components/engine-admins";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken, client } = await engineInstancePageHandler({
    engineId: params.engineId,
    projectSlug: params.project_slug,
    teamSlug: params.team_slug,
  });

  return (
    <EngineAdmins
      authToken={authToken}
      client={client}
      instanceUrl={instance.url}
    />
  );
}
