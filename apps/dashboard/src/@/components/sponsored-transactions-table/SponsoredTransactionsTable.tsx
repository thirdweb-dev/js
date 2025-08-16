"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { analyticsServerProxy } from "@/actions/proxies";
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
    method: "GET",
    pathname: "/v2/bundler/sponsored-transactions",
    searchParams: {
      chainId: params.chainId,
      from: params.from,
      limit: params.limit.toString(),
      offset: params.offset.toString(),
      projectId: params.projectId,
      teamId: params.teamId,
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
    parseAsText: true,
    pathname: "/v2/bundler/sponsored-transactions/export",
    searchParams: {
      from: params.from,
      teamId: params.teamId,
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
    chainId: filters.chainId,
    from: props.from,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    projectId: filters.projectId,
    teamId: props.teamId,
    to: props.to,
  };

  const sponsoredTransactionsQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      return getSponsoredTransactions(params);
    },
    queryKey: ["sponsored-transactions", params],
    refetchOnWindowFocus: false,
  });

  const totalPages = sponsoredTransactionsQuery.data
    ? Math.ceil(sponsoredTransactionsQuery.data.meta.total / pageSize)
    : 0;

  return (
    <SponsoredTransactionsTableUI
      client={props.client}
      filters={filters}
      getCSV={() => {
        return getSponsoredTransactionsCSV({
          from: props.from,
          teamId: props.teamId,
          to: props.to,
        });
      }}
      isError={sponsoredTransactionsQuery.isError}
      isPending={sponsoredTransactionsQuery.isFetching}
      pageNumber={page}
      pageSize={pageSize}
      projects={props.variant === "team" ? props.projects : []}
      setFilters={(v) => {
        setFilters(v);
        setPage(1);
      }}
      setPageNumber={setPage}
      sponsoredTransactions={sponsoredTransactionsQuery.data?.data ?? []}
      teamSlug={props.teamSlug}
      totalPages={totalPages}
      variant={props.variant}
    />
  );
}
