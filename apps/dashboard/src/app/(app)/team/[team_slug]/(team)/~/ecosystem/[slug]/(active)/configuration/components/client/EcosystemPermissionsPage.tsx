"use client";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useEcosystem } from "../../../hooks/use-ecosystem";
import { AuthOptionsSection } from "../server/auth-options-section";
import { EcosystemPartnersSection } from "../server/ecosystem-partners-section";
import { IntegrationPermissionsSection } from "../server/integration-permissions-section";

export function EcosystemPermissionsPage({
  params,
  authToken,
  teamId,
}: {
  params: { slug: string; team_slug: string };
  authToken: string;
  teamId: string;
}) {
  const { data: ecosystem } = useEcosystem({
    slug: params.slug,
    teamIdOrSlug: params.team_slug,
  });

  const client = getClientThirdwebClient({ jwt: authToken, teamId });

  return (
    <div className="flex flex-col gap-8">
      <IntegrationPermissionsSection
        ecosystem={ecosystem}
        authToken={authToken}
        teamId={teamId}
      />
      <AuthOptionsSection
        ecosystem={ecosystem}
        authToken={authToken}
        teamId={teamId}
        client={client}
      />
      {ecosystem?.permission === "PARTNER_WHITELIST" && (
        <EcosystemPartnersSection
          teamSlug={params.team_slug}
          ecosystem={ecosystem}
          authToken={authToken}
          teamId={teamId}
        />
      )}
    </div>
  );
}
