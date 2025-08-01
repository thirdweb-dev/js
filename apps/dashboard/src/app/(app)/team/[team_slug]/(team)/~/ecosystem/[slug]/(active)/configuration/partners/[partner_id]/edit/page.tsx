import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { fetchEcosystem } from "@/api/ecosystems";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { UpdatePartnerForm } from "../../../components/client/update-partner-form.client";
import { fetchPartnerDetails } from "../../../hooks/fetchPartnerDetails";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ slug: string; team_slug: string; partner_id: string }>;
}) {
  const { slug, team_slug, partner_id } = await params;
  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(team_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/~/ecosystem/${slug}/configuration`);
  }

  if (!team) {
    notFound();
  }

  const teamSlug = team_slug;
  const ecosystemSlug = slug;
  const partnerId = partner_id;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  try {
    const ecosystem = await fetchEcosystem(ecosystemSlug, teamSlug);

    if (!ecosystem) {
      throw new Error("Ecosystem not found");
    }

    try {
      const partner = await fetchPartnerDetails({
        authToken,
        ecosystem,
        partnerId,
        teamId: team.id,
      });

      if (!partner) {
        return (
          <div className="container py-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-6 font-semibold text-2xl tracking-tight">
                Error
              </h1>
              <p>Could not load partner details. Please try again.</p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col">
          <div className="container">
            <h1 className="mb-6 font-semibold text-2xl tracking-tight">
              Edit Partner: {partner.name}
            </h1>
            <UpdatePartnerForm
              authToken={authToken}
              client={client}
              ecosystem={ecosystem}
              partner={partner}
              teamId={team.id}
            />
          </div>
        </div>
      );
    } catch (partnerError) {
      console.error("Error fetching partner:", partnerError);
      return (
        <div className="container py-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 font-semibold text-2xl tracking-tight">
              Error
            </h1>
            <p>Could not load partner details. Please try again.</p>
          </div>
        </div>
      );
    }
  } catch (ecosystemError) {
    console.error("Error fetching ecosystem:", ecosystemError);
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
