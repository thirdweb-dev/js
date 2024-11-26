import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";
import { EcosystemWalletPricingCard } from "./components/pricing-card";

export async function EcosystemCreatePage(props: { teamSlug: string }) {
  return (
    <div className="flex w-full flex-col gap-6 md:mx-auto md:max-w-lg lg:max-w-4xl">
      <header className="flex flex-col gap-1">
        <h2 className="font-semibold text-3xl text-foreground tracking-tight">
          Create an Ecosystem
        </h2>
        <p className="text-muted-foreground">
          Create wallets that work across every chain and every app.
        </p>
      </header>
      <main className="grid w-full gap-6 lg:grid-cols-2">
        <section className="flex items-start">
          <EcosystemWalletPricingCard />
        </section>
        <section className="mb-12 lg:px-4">
          <CreateEcosystemForm teamSlug={props.teamSlug} />
        </section>
      </main>
    </div>
  );
}
