"use client";
import { EcosystemPartnersSection } from "./components/server/ecosystem-partners-section";
import { IntegrationPermissionsSection } from "./components/server/integration-permissions-section";
import { useEcosystem } from "./hooks/use-ecosystem";

export function EcosystemPermissionsPage({
  params,
}: { params: { slug: string } }) {
  const { ecosystem } = useEcosystem({ slug: params.slug });

  return (
    <div className="flex flex-col gap-12">
      <IntegrationPermissionsSection ecosystem={ecosystem} />
      {ecosystem?.permission === "PARTNER_WHITELIST" && (
        <EcosystemPartnersSection ecosystem={ecosystem} />
      )}
    </div>
  );
}
