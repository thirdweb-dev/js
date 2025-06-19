import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "@app/api/lib/getAuthToken";
import { loginRedirect } from "@app/login/loginRedirect";
import { redirect } from "next/navigation";
import { CreateAssetPageHeader } from "../_common/PageHeader";
import { CreateTokenAssetPage } from "./create-token-page-impl";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project, accountAddress] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
    getAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/tokens/create/token`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex grow flex-col">
      <CreateAssetPageHeader
        teamSlug={params.team_slug}
        projectSlug={params.project_slug}
        title="Create Coin"
        description="Launch an ERC-20 coin for your project"
        containerClassName="container max-w-5xl"
      />
      <div className="container max-w-5xl pt-8 pb-32">
        <CreateTokenAssetPage
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          accountAddress={accountAddress}
          client={client}
          teamId={team.id}
          projectId={project.id}
        />
      </div>
    </div>
  );
}
