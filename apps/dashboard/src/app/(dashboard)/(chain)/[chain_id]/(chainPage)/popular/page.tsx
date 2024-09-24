import { type SortBy, fetchTopContracts } from "lib/search";
import { CircleAlertIcon } from "lucide-react";
import { TrendingContractSection } from "../../../../trending/components/trending-table";
import { getChain } from "../../../utils";

// we're using searchParams here - use dynamic rendering
export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: { chain_id: string };
  searchParams: { page?: number; sortBy?: SortBy };
}) {
  const chain = await getChain(props.params.chain_id);
  const topContracts = await fetchTopContracts({
    chainId: chain.chainId,
    page: props.searchParams.page,
    sortBy: props.searchParams.sortBy,
    perPage: 15,
    timeRange: "month",
  });

  return (
    <section className="mt-2">
      <h2 className="mb-2 font-semibold text-2xl tracking-tighter">
        Popular Contracts
      </h2>

      <p className="text-muted-foreground text-sm">
        Explore contracts on Ethereum and sort them by your preferred metrics
      </p>

      <div className="h-8" />

      {topContracts.length > 0 && (
        <TrendingContractSection
          topContracts={topContracts}
          chainId={chain.chainId}
          searchParams={props.searchParams}
          showPagination={true}
        />
      )}

      {topContracts.length === 0 && (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-border text-lg text-muted-foreground">
          <div className="flex items-center gap-2">
            <CircleAlertIcon className="size-5 text-destructive-text" />
            No contracts found
          </div>
        </div>
      )}
    </section>
  );
}
