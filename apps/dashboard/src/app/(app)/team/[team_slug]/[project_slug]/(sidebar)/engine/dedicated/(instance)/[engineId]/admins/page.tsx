import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { EngineAdmins } from "./components/engine-admins";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken, client } = await engineInstancePageHandler({
    engineId: params.engineId,
    teamSlug: params.team_slug,
    projectSlug: params.project_slug,
  });

  return (
    <EngineAdmins
      instanceUrl={instance.url}
      authToken={authToken}
      client={client}
    />
  );
}
