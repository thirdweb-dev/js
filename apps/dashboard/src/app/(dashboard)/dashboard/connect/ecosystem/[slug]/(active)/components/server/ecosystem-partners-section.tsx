import type { Ecosystem } from "../../../../types";
import { AddPartnerForm } from "../client/add-partner-form.client";
import { PartnersTable } from "./partners-table";

export function EcosystemPartnersSection({
  ecosystem,
}: { ecosystem: Ecosystem }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-semibold text-foreground">
          Ecosystem partners
        </h4>
        <p className="text-sm text-muted-foreground">
          Configure apps that can use your wallet. Creating a partner will
          generate a unique partner ID that can access your ecosystem. You will
          need to generate at least one partner ID for use in your own app.
        </p>
      </div>

      <AddPartnerForm ecosystem={ecosystem} />
      <PartnersTable ecosystem={ecosystem} />
    </section>
  );
}
