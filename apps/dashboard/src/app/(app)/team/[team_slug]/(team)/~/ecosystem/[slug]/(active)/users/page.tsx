import { loginRedirect } from "@app/login/loginRedirect";
import { InAppWalletUsersPageContent } from "@app/team/[team_slug]/[project_slug]/(sidebar)/wallets/users/components";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { fetchEcosystem } from "@/api/ecosystems";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";

export default async function EcosystemUsersPage(props: {
  params: Promise<{ team_slug: string; slug: string }>;
}) {
  const params = await props.params;
  const [authToken, ecosystem, team] = await Promise.all([
    getAuthToken(),
    fetchEcosystem(params.slug, params.team_slug),
    getTeamBySlug(params.team_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/~/ecosystem/${params.slug}/users`,
    );
  }

  if (!ecosystem || !team) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <InAppWalletUsersPageContent
      authToken={authToken}
      client={client}
      ecosystemSlug={ecosystem.slug}
    />
  );
}