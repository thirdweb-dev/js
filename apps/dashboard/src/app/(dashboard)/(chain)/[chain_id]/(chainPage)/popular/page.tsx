import { CircleAlertIcon } from "lucide-react";
import React from "react";
import { type SortBy, fetchTopContracts } from "../../../../../../lib/search";
import { TrendingContractSection } from "../../../../trending/components/trending-table";
import { getChain } from "../../../utils";
import { SectionTitle } from "../components/server/SectionTitle";

export default async function Page(props: {
  params: { chain_id: string };
  searchParams: { page?: number; sortBy?: SortBy };
}) {
  const chain = await getChain(props.params.chain_id);
  const topContracts = await fetchTopContracts({
    chainId: chain.chainId,
    page: props.searchParams.page,
    sortBy: props.searchParams.sortBy,
    perPage: 20,
    timeRange: "month",
  });

  return (
    <section>
      <SectionTitle title="Popular Contracts" />

      {topContracts.length > 0 && (
        <TrendingContractSection
          topContracts={topContracts}
          chainId={chain.chainId}
          searchParams={props.searchParams}
          showPagination={true}
        />
      )}

      {topContracts.length === 0 && (
        <div className="text-secondary-foreground text-lg flex border rounded-lg h-[200px] border-border items-center justify-center">
          <div className="flex items-center gap-2">
            <CircleAlertIcon className="size-5 text-destructive-text" />
            No contracts found
          </div>
        </div>
      )}
    </section>
  );
}
