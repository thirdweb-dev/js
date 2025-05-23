import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { SearchInput } from "./components/client/search";
import { QueryType } from "./components/client/type";
import { RouteListView } from "./components/client/view";
import {
  RoutesData,
  type SearchParams,
} from "./components/server/routes-table";

const title = "Universal Bridge Routes: Swap, Bridge, and Onramp";
const description =
  "A list of token routes for swapping, bridging, and on-ramping between EVM chains with thirdweb.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function RoutesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const authToken = await getAuthToken();
  const headersList = await headers();
  const viewportWithHint = Number(
    headersList.get("Sec-Ch-Viewport-Width") || 0,
  );
  const searchParams = await props.searchParams;

  const activeType = searchParams.type ?? "origin";

  // default is driven by viewport hint
  const activeView = searchParams.view
    ? searchParams.view
    : viewportWithHint > 1000
      ? "table"
      : "grid";

  return (
    <section className="container mx-auto flex h-full flex-col px-4 py-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-4xl tracking-tighter lg:text-5xl">
              Routes
            </h1>
          </div>
          <div className="flex flex-row items-end gap-4 lg:flex-col">
            <div className="flex w-full flex-row items-center gap-4">
              <SearchInput />
              <QueryType activeType={activeType} />
              <RouteListView activeView={activeView} />
            </div>
          </div>
        </div>
      </header>
      <div className="h-10" />
      <div className="relative overflow-hidden rounded-lg border-2 border-green-500/20 bg-gradient-to-br from-card/80 to-card/50 p-4 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-lg">
              Get Started with Universal Bridge
            </h3>
            <p className="text-muted-foreground text-sm">
              Simple, instant, and secure payments across any token and chain.
            </p>
          </div>
          <a
            href="https://portal.thirdweb.com/pay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
          >
            Learn More
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>
      </div>
      <div className="h-10" />
      <RoutesData
        searchParams={searchParams}
        activeView={activeView}
        isLoggedIn={!!authToken}
      />
    </section>
  );
}
