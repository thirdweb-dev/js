import type { Metadata } from "next";
import { headers } from "next/headers";
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

export const metadata: Metadata = {
  title: "Chainlist: RPCs, Block Explorers, Faucets",
  description:
    "A list of EVM networks with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.",
};

// we use headers() to determine if we should default to table or grid view by checking viewport
// so this page needs to be forced as dynamic
export const dynamic = "force-dynamic";

export default function ChainListPage(props: { searchParams: SearchParams }) {
  const headersList = headers();
  const viewportWithHint = Number(
    headersList.get("Sec-Ch-Viewport-Width") || 0,
  );

  // default is driven by viewport hint
  const activeView = props.searchParams.view
    ? props.searchParams.view
    : viewportWithHint > 1000
      ? "table"
      : "grid";

  return (
    <section className="container mx-auto py-10 px-4 h-full flex flex-col">
      <header className="flex flex-col gap-4">
        <div className="flex gap-4 flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex gap-4 flex-row items-center justify-between lg:justify-start lg:flex-col">
            <h1 className="font-semibold text-4xl lg:text-5xl tracking-tighter">
              Chainlist
            </h1>
            <AddYourChainButton className="lg:hidden" />
          </div>
          <div className="flex flex-row lg:flex-col gap-4 items-end">
            <div className="flex flex-row gap-4 w-full">
              <SearchInput />
              <ChainListView activeView={activeView} />
              <AddYourChainButton className="hidden lg:flex" />
            </div>

            <div className="flex flex-row gap-2">
              <AllFilters />
              <div className="hidden lg:flex flex-row gap-2">
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
      <ChainsData searchParams={props.searchParams} activeView={activeView} />
    </section>
  );
}
