import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../login/loginRedirect";
import { getEngineInstances } from "../_utils/getEngineInstances";
import {
  EngineInstancesList,
  NoEngineInstancesPage,
} from "./overview/engine-list";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/engine`);
  }

  const res = await getEngineInstances({ authToken });

  if (!res.data || res.data.length === 0) {
    return <NoEngineInstancesPage team_slug={params.team_slug} />;
  }

  return (
    <EngineInstancesList team_slug={params.team_slug} instances={res.data} />
  );
}
