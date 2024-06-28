"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useMemo } from "react";
import { useEcosystemList } from "../../hooks/use-ecosystem-list";
import { IntegrationPermissionsSection } from "../components/client/integration-permissions-section.client";
import { EcosystemPartnersSection } from "../components/server/ecosystem-partners-section";

export default function Page({ params }: { params: { ecosystemId: string } }) {
  // we don't have a "fetch ecosystem" endpoint yet so for now we have to get all of them
  const { ecosystems } = useEcosystemList();

  const currentEcosystem = useMemo(
    () => ecosystems?.find((ecosystem) => ecosystem.id === params.ecosystemId),
    [ecosystems, params.ecosystemId],
  );

  if (!currentEcosystem) {
    return (
      <div className="container flex flex-col gap-8 px-4 py-6">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <main className="space-y-12">
      <IntegrationPermissionsSection ecosystem={currentEcosystem} />
      {currentEcosystem?.permission === "PARTNER_WHITELIST" && (
        <EcosystemPartnersSection ecosystem={currentEcosystem} />
      )}
    </main>
  );
}
