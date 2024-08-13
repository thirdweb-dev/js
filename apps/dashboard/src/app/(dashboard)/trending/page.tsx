import { type SortBy, type TimeRange, fetchTopContracts } from "lib/search";
import type { Metadata } from "next";
import { TrendingContractSection } from "./components/trending-table";

export const metadata: Metadata = {
  title: "Trending Contracts",
  description: "See what's hot onchain right now",
  openGraph: {
    title: "Trending Contracts",
    description: "See what's hot onchain right now",
  },
};

// we're using searchParams here - use dynamic rendering
export const dynamic = "force-dynamic";

export default async function DashboardContractTrendingPage(props: {
  searchParams: { timeRange?: TimeRange; page?: number; sortBy?: SortBy };
}) {
  const topContracts = await fetchTopContracts({
    ...props.searchParams,
    timeRange: "month",
    perPage: 20,
  });

  return (
    <div className="container px-4 py-10">
      <h1 className="text-3xl md:text-4xl tracking-tight font-semibold mb-5">
        Trending Contracts
      </h1>

      <TrendingContractSection
        topContracts={topContracts}
        searchParams={props.searchParams}
        showPagination={true}
      />
    </div>
  );
}
