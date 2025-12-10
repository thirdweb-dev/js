"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFleetTransactions, getFleetTransactionsSummary } from "./api";

type UseFleetTransactionsParams = {
  teamId: string;
  fleetId: string;
  from: string;
  to: string;
  limit: number;
  offset: number;
  chainId?: number;
};

/**
 * React Query hook for fetching paginated fleet transactions.
 */
export function useFleetTransactions(params: UseFleetTransactionsParams) {
  return useQuery({
    queryKey: ["fleet-transactions", params],
    queryFn: () => getFleetTransactions(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

type UseFleetTransactionsSummaryParams = {
  teamId: string;
  fleetId: string;
  from: string;
  to: string;
  enabled?: boolean;
};

/**
 * React Query hook for fetching fleet transactions summary.
 */
export function useFleetTransactionsSummary(
  params: UseFleetTransactionsSummaryParams,
) {
  return useQuery({
    queryKey: ["fleet-transactions-summary", params],
    queryFn: () => getFleetTransactionsSummary(params),
    refetchOnWindowFocus: false,
    enabled: params.enabled !== false,
  });
}
