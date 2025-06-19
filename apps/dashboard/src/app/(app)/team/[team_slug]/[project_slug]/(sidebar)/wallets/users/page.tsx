import { getProject } from "@/api/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { loginRedirect } from "@app/login/loginRedirect";
import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/wallets/users`,
    );
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <InAppWalletUsersPageContent
      projectClientId={project.publishableKey}
      authToken={authToken}
      client={client}
    />
  );
}
