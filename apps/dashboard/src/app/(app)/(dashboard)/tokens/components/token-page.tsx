"use client";

import { useQuery } from "@tanstack/react-query";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { ActivityIcon, SearchIcon, TrendingUpIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Bridge } from "thirdweb";
import { BridgeNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TokensTable } from "./tokens-table";

const client = getClientThirdwebClient();

const pageSize = 20;

type Filter =
  | { type: "filter"; value: "volume" | "market_cap" }
  | { type: "search"; value: string };

export function TokenPage(props: { chains: Bridge.chains.Result }) {
  const [page, setPage] = useState(1);
  const [chainId, setChainId] = useState(1);
  const [filter, _setFilter] = useState<Filter>({
    type: "filter",
    value: "volume",
  });

  const setFilter = useCallback((filter: Filter) => {
    _setFilter(filter);
    setPage(1);
  }, []);

  const tokensQuery = useQuery({
    queryKey: [
      "tokens",
      {
        page,
        chainId,
        filter,
      },
    ],
    queryFn: () => {
      return Bridge.tokens({
        client: client,
        chainId: chainId,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sortBy: filter.type === "filter" ? filter.value : undefined,
        query: filter.type === "search" ? filter.value : undefined,
      });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="pb-20 pt-8">
      <div className="container max-w-7xl">
        <div className="mb-4 flex gap-4 lg:gap-3 flex-col lg:flex-row">
          <BridgeNetworkSelector
            client={client}
            chainId={chainId}
            onChange={setChainId}
            className="rounded-xl bg-card lg:w-fit min-w-[280px]"
            popoverContentClassName="!w-[300px] rounded-xl overflow-hidden"
            chains={props.chains}
          />

          <div className="flex gap-3">
            <SortButton
              label="Popular"
              onClick={() => {
                setFilter({ type: "filter", value: "market_cap" });
              }}
              isSelected={
                filter.type === "filter" && filter.value === "market_cap"
              }
              icon={ActivityIcon}
            />
            <SortButton
              label="Trending"
              onClick={() => {
                setFilter({ type: "filter", value: "volume" });
              }}
              isSelected={filter.type === "filter" && filter.value === "volume"}
              icon={TrendingUpIcon}
            />
          </div>

          <div className="relative w-full lg:w-[420px] ml-auto">
            <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Tokens"
              value={filter.type === "search" ? filter.value : ""}
              className="rounded-xl bg-card flex-1 pl-9"
              onChange={(e) =>
                setFilter({ type: "search", value: e.target.value })
              }
            />
          </div>
        </div>

        <TokensTable
          pageSize={pageSize}
          tokens={tokensQuery.data ?? []}
          isFetching={tokensQuery.isFetching}
          pagination={{
            onNext: () => setPage(page + 1),
            onPrevious: () => setPage(page - 1),
            nextDisabled: !!(
              tokensQuery.data && tokensQuery.data.length < pageSize
            ),
            previousDisabled: page === 1,
          }}
        />
      </div>
    </div>
  );
}

function SortButton(props: {
  label: string;
  onClick: () => void;
  isSelected: boolean;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Button
      variant="outline"
      onClick={props.onClick}
      className={cn(
        "rounded-xl gap-2 bg-card",
        props.isSelected && "bg-accent border-active-border",
      )}
    >
      <props.icon className="size-3.5" />
      {props.label}
    </Button>
  );
}
