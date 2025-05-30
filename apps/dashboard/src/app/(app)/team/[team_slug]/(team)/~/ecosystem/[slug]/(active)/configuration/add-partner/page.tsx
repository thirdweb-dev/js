import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../../login/loginRedirect";
import { AddPartnerForm } from "../components/client/add-partner-form.client";
import { fetchEcosystem } from "../hooks/fetchEcosystem";

export default async function AddPartnerPage({
  params,
}: {
  params: Promise<{ slug: string; team_slug: string }>;
}) {
  const { slug, team_slug } = await params;
  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(team_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/~/ecosystem/${slug}`);
  }

  if (!team) {
    notFound();
  }

  const teamSlug = team_slug;
  const ecosystemSlug = slug;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  try {
    const ecosystem = await fetchEcosystem({
      teamIdOrSlug: teamSlug,
      slug: ecosystemSlug,
      authToken,
    });

    return (
      <div className="flex flex-col">
        <div className="container">
          <h1 className="mb-6 font-semibold text-2xl tracking-tight">
            Add New Partner
          </h1>
          <AddPartnerForm
            ecosystem={ecosystem}
            authToken={authToken}
            teamId={team.id}
            client={client}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching ecosystem:", error);
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 font-semibold text-2xl tracking-tight">Error</h1>
          <p>Could not load ecosystem. Please try again.</p>
        </div>
      </div>
    );
  }
}
