import type { Ecosystem } from "../../../types";
import { AddPartnerForm } from "../client/add-partner-form.client";
import { PartnersTable } from "./partners-table";

export function EcosystemPartnersSection({
  ecosystem,
}: { ecosystem: Ecosystem }) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-2xl font-semibold text-foreground">
          Ecosystem partners
        </h4>
        <p className="text-sm text-muted-foreground">
          Configure partners that can use your wallet.
        </p>
      </div>

      <AddPartnerForm ecosystemId={ecosystem.id} />
      <PartnersTable ecosystem={ecosystem} />
    </section>
  );
}
