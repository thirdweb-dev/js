import { CircleAlertIcon } from "lucide-react";
import React from "react";
import {
  type SortBy,
  type TimeRange,
  fetchTopContracts,
} from "../../../../../../lib/search";
import { TrendingContractSection } from "../../../../trending/components/trending-table";
import { getChain } from "../../../utils";
import { SectionTitle } from "../components/server/SectionTitle";

export default async function Page(props: {
  params: { chain_id: string };
  searchParams: { timeRange?: TimeRange; page?: number; sortBy?: SortBy };
}) {
  const chain = await getChain(props.params.chain_id);
  const topContracts = await fetchTopContracts({
    chainId: chain.chainId,
    timeRange: props.searchParams.timeRange,
    page: props.searchParams.page,
    sortBy: props.searchParams.sortBy,
  });

  return (
    <section>
      <SectionTitle title="Popular Contracts" />

      {topContracts.length > 0 && (
        <TrendingContractSection
          topContracts={topContracts}
          chainId={chain.chainId}
          searchParams={props.searchParams}
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
