import { redirect } from "next/navigation";
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
  searchParams: Promise<{
    importUrl?: string;
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  if (searchParams.importUrl) {
    redirect(
      `/team/${params.team_slug}/~/engine/import?importUrl=${searchParams.importUrl}`,
    );
  }

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
