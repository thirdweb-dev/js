import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { fetchEcosystem } from "@/api/team/ecosystems";
import { getTeamBySlug } from "@/api/team/get-team";
import { InAppWalletUsersPageContent } from "@/components/in-app-wallet-users-content/in-app-wallet-users-content";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";

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
    loginRedirect(`/team/${params.team_slug}/~/ecosystem/${params.slug}/users`);
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
      teamId={team.id}
    />
  );
}
