"use client";
import { analyticsServerProxy } from "@/actions/proxies";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb/dist/types/client/client";
import {
  type SponsoredTransaction,
  SponsoredTransactionsTableUI,
} from "./SponsoredTransactionsTableUI";

type GetSponsoredTransactionsParams = {
  teamId: string;
  limit: number;
  offset: number;
  from: string;
  to: string;
  // optional
  projectId?: string;
  chainId?: string;
};

const getSponsoredTransactions = async (
  params: GetSponsoredTransactionsParams,
) => {
  const res = await analyticsServerProxy<{
    data: SponsoredTransaction[];
    meta: {
      total: number;
    };
  }>({
    pathname: "/v2/bundler/sponsored-transactions",
    method: "GET",
    searchParams: {
      teamId: params.teamId,
      limit: params.limit.toString(),
      offset: params.offset.toString(),
      projectId: params.projectId,
      chainId: params.chainId,
      from: params.from,
      to: params.to,
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data;
};

async function getSponsoredTransactionsCSV(params: {
  teamId: string;
  from: string;
  to: string;
}) {
  const res = await analyticsServerProxy<string>({
    method: "GET",
    pathname: "/v2/bundler/sponsored-transactions/export",
    parseAsText: true,
    searchParams: {
      teamId: params.teamId,
      from: params.from,
      to: params.to,
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data;
}

export function SponsoredTransactionsTable(
  props: {
    client: ThirdwebClient;
    teamId: string;
    teamSlug: string;
    from: string;
    to: string;
  } & (
    | {
        variant: "team";
        projects: {
          id: string;
          name: string;
          image: string | null;
          slug: string;
        }[];
      }
    | {
        variant: "project";
        projectId: string;
      }
  ),
) {
  const pageSize = 10;
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<{
    chainId?: string;
    projectId?: string;
  }>({
    projectId: props.variant === "project" ? props.projectId : undefined,
  });

  const params = {
    teamId: props.teamId,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    from: props.from,
    to: props.to,
    chainId: filters.chainId,
    projectId: filters.projectId,
  };

  const sponsoredTransactionsQuery = useQuery({
    queryKey: ["sponsored-transactions", params],
    queryFn: () => {
      return getSponsoredTransactions(params);
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const totalPages = sponsoredTransactionsQuery.data
    ? Math.ceil(sponsoredTransactionsQuery.data.meta.total / pageSize)
    : 0;

  return (
    <SponsoredTransactionsTableUI
      filters={filters}
      variant={props.variant}
      projects={props.variant === "team" ? props.projects : []}
      setFilters={(v) => {
        setFilters(v);
        setPage(1);
      }}
      client={props.client}
      isError={sponsoredTransactionsQuery.isError}
      getCSV={() => {
        return getSponsoredTransactionsCSV({
          teamId: props.teamId,
          from: props.from,
          to: props.to,
        });
      }}
      isPending={sponsoredTransactionsQuery.isFetching}
      sponsoredTransactions={sponsoredTransactionsQuery.data?.data ?? []}
      pageNumber={page}
      setPageNumber={setPage}
      pageSize={pageSize}
      teamSlug={props.teamSlug}
      totalPages={totalPages}
    />
  );
}
