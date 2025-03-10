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

const title = "Routes: Swap, Bridge, and On-Ramp";
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
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:justify-start">
            <h1 className="font-semibold text-4xl tracking-tighter lg:text-5xl">
              Routes
            </h1>
          </div>
          <div className="flex flex-row items-end gap-4 lg:flex-col ">
            <div className="flex w-full flex-row gap-4">
              <SearchInput />
              <QueryType activeType={activeType} />
              <RouteListView activeView={activeView} />
            </div>
          </div>
        </div>
      </header>
      <div className="h-10" />
      <RoutesData
        searchParams={searchParams}
        activeView={activeView}
        isLoggedIn={!!authToken}
      />
    </section>
  );
}
