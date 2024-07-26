import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";
import { EcosystemWalletPricingCard } from "./components/pricing-card";

export default function Page() {
  return (
    <div className="flex flex-col w-full gap-10 px-2 py-10 sm:px-4">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-foreground">
          Create an Ecosystem
        </h2>
        <p className="text-secondary-foreground">
          Create wallets that work across every chain and every app.
        </p>
      </header>
      <main className="grid w-full max-w-sm gap-8 md:max-w-lg lg:max-w-4xl xl:gap-12 lg:grid-cols-2">
        <section className="flex items-start">
          <EcosystemWalletPricingCard />
        </section>
        <section className="mb-12 lg:px-4">
          <CreateEcosystemForm />
        </section>
      </main>
    </div>
  );
}
