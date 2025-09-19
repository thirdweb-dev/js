"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@workspace/ui/lib/utils";
import { ActivityIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import { Bridge } from "thirdweb";
import { BridgeNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TokensTable } from "./tokens-table";

const client = getClientThirdwebClient();

const pageSize = 20;

export function TokenPage() {
  const [page, setPage] = useState(1);
  const [chainId, setChainId] = useState(1);
  const [sortBy, setSortBy] = useState<"volume" | "market_cap">("volume");

  const tokensQuery = useQuery({
    queryKey: [
      "tokens",
      {
        page,
        chainId,
        sortBy,
      },
    ],
    queryFn: () => {
      return Bridge.tokens({
        client: client,
        chainId: chainId,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sortBy,
      });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="pb-20 pt-8">
      <div className="container max-w-7xl">
        <div className="mb-4 flex gap-3 flex-col lg:flex-row">
          <BridgeNetworkSelector
            client={client}
            chainId={chainId}
            onChange={setChainId}
            className="rounded-full bg-card lg:w-fit min-w-[320px]"
            popoverContentClassName="!w-[350px] rounded-xl overflow-hidden"
          />

          <div className="flex gap-3">
            <SortButton
              label="Popular"
              onClick={() => setSortBy("market_cap")}
              isSelected={sortBy === "market_cap"}
              icon={ActivityIcon}
            />
            <SortButton
              label="Trending"
              onClick={() => setSortBy("volume")}
              isSelected={sortBy === "volume"}
              icon={TrendingUpIcon}
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
