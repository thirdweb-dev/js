import type { Metadata } from "next";
import { headers } from "next/headers";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import {
  AllFilters,
  ChainOptionsFilter,
  ChainServiceFilter,
  ChainTypeFilter,
} from "./components/client/filters";
import { SearchInput } from "./components/client/search";
import { ChainListView } from "./components/client/view";
import { AddYourChainButton } from "./components/server/add-chain-button";
import { ChainsData, type SearchParams } from "./components/server/chain-table";

const title = "Chainlist: RPCs, Block Explorers, Faucets";
const description =
  "A list of EVM networks with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function ChainListPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const authToken = await getAuthToken();
  const headersList = await headers();
  const viewportWithHint = Number(
    headersList.get("Sec-Ch-Viewport-Width") || 0,
  );
  const searchParams = await props.searchParams;

  // default is driven by viewport hint
  const activeView = searchParams.view
    ? searchParams.view
    : viewportWithHint > 1000
      ? "table"
      : "grid";

  return (
    <section className="container mx-auto flex h-full flex-col px-4 py-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:justify-start">
            <h1 className="font-semibold text-4xl tracking-tighter lg:text-5xl">
              Chainlist
            </h1>
            <AddYourChainButton className="lg:hidden" />
          </div>
          <div className="flex flex-row items-end gap-4 lg:flex-col ">
            <div className="flex w-full flex-row gap-4">
              <SearchInput />
              <ChainListView activeView={activeView} />
              <AddYourChainButton className="hidden lg:flex" />
            </div>

            <div className="flex flex-row gap-2">
              <AllFilters />
              <div className="hidden flex-row gap-2 lg:flex">
                <ChainTypeFilter />
                <ChainOptionsFilter />
                <ChainServiceFilter />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-10" />
      {/* we used to have suspense + spinner here, that feels more jarring than the page loading _minutely_ slower */}
      <ChainsData
        searchParams={searchParams}
        activeView={activeView}
        isLoggedIn={!!authToken}
      />
    </section>
  );
}
