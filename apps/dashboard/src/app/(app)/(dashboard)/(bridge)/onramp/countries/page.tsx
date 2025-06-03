import type { Metadata } from "next";
import {
  type OnrampProvider,
  ProviderSelector,
} from "./components/client/provider";
import { CountriesTable } from "./components/server/countries-table";

const title = "Onramp Country Support";
const description = "Countries and currencies supported by onramp providers.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function OnrampCountriesPage(props: {
  searchParams: Promise<{ provider?: OnrampProvider }>;
}) {
  const searchParams = await props.searchParams;
  const activeProvider: OnrampProvider =
    (searchParams.provider as OnrampProvider) || "coinbase";

  return (
    <section className="container mx-auto flex h-full flex-col px-4 py-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-4xl tracking-tighter lg:text-5xl">
              Onramp Countries
            </h1>
          </div>
          <div className="flex flex-row items-end gap-4 lg:flex-col">
            <div className="flex w-full flex-row items-center gap-4">
              <ProviderSelector activeProvider={activeProvider} />
            </div>
          </div>
        </div>
      </header>
      <div className="h-10" />
      <CountriesTable provider={activeProvider} />
    </section>
  );
}
