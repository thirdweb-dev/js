import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import { EcosystemPermissionsPage } from "./components/client/EcosystemPermissionsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; slug: string }>;
}) {
  const params = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/~/ecosystem/${params.slug}/configuration`,
    );
  }

  return <EcosystemPermissionsPage params={params} authToken={authToken} />;
}
