import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";
import { EcosystemWalletPricingCard } from "./components/pricing-card";

export function EcosystemCreatePage(props: {
  ecosystemLayoutPath: string;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="font-semibold text-3xl text-foreground tracking-tight">
          Create an Ecosystem
        </h2>
        <p className="text-muted-foreground">
          Create wallets that work across every chain and every app.
        </p>
      </header>
      <main className="grid w-full max-w-sm gap-6 md:max-w-lg lg:max-w-4xl lg:grid-cols-2">
        <section className="flex items-start">
          <EcosystemWalletPricingCard />
        </section>
        <section className="mb-12 lg:px-4">
          <CreateEcosystemForm
            ecosystemLayoutPath={props.ecosystemLayoutPath}
          />
        </section>
      </main>
    </div>
  );
}
