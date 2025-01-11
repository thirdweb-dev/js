"use client";
import { useEcosystem } from "../../../hooks/use-ecosystem";
import { AuthOptionsSection } from "../server/auth-options-section";
import { EcosystemPartnersSection } from "../server/ecosystem-partners-section";
import { IntegrationPermissionsSection } from "../server/integration-permissions-section";

export function EcosystemPermissionsPage({
  params,
  authToken,
}: { params: { slug: string }; authToken: string }) {
  const { ecosystem } = useEcosystem({ slug: params.slug });

  return (
    <div className="flex flex-col gap-8">
      <IntegrationPermissionsSection
        ecosystem={ecosystem}
        authToken={authToken}
      />
      <AuthOptionsSection ecosystem={ecosystem} authToken={authToken} />
      {ecosystem?.permission === "PARTNER_WHITELIST" && (
        <EcosystemPartnersSection ecosystem={ecosystem} authToken={authToken} />
      )}
    </div>
  );
}
