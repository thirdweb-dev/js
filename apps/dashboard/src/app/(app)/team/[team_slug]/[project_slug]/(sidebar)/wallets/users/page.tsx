import { loginRedirect } from "@app/login/loginRedirect";
import { InAppWalletUsersPageContent } from "@app/team/[team_slug]/[project_slug]/(sidebar)/wallets/users/components";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";

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
      authToken={authToken}
      client={client}
      projectClientId={project.publishableKey}
      teamId={project.teamId}
    />
  );
}
