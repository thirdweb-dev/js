import type { Ecosystem } from "../../../../types";
import { AddPartnerDialogButton } from "../client/AddPartnerDialogButton";
import { PartnersTable } from "./partners-table";

export function EcosystemPartnersSection({
  ecosystem,
}: { ecosystem: Ecosystem }) {
  return (
    <section className="flex flex-col gap-8 lg:gap-6">
      <div className="flex lg:justify-between gap-6 lg:items-start flex-col lg:flex-row">
        <div className="flex flex-col gap-1">
          <h4 className="text-2xl font-semibold text-foreground">
            Ecosystem partners
          </h4>
          <p className="text-sm text-muted-foreground leading-normal">
            Configure apps that can use your wallet. Creating a partner will
            generate a unique partner ID that can access your ecosystem. <br />{" "}
            You will need to generate at least one partner ID for use in your
            own app.
          </p>
        </div>

        <AddPartnerDialogButton ecosystem={ecosystem} />
      </div>

      <PartnersTable ecosystem={ecosystem} />
    </section>
  );
}
