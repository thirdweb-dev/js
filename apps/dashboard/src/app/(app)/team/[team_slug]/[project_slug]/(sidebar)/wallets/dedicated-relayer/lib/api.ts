"use server";

import { analyticsServerProxy } from "@/actions/proxies";
import type { FleetTransaction, FleetTransactionsSummary } from "../types";

type GetFleetTransactionsParams = {
  teamId: string;
  fleetId: string;
  from: string;
  to: string;
  limit: number;
  offset: number;
  chainId?: number;
};

/**
 * Fetches paginated fleet transactions from the analytics service.
 */
export async function getFleetTransactions(params: GetFleetTransactionsParams) {
  const res = await analyticsServerProxy<{
    data: FleetTransaction[];
    meta: { total: number };
  }>({
    method: "GET",
    pathname: "/v2/bundler/fleet-transactions",
    searchParams: {
      teamId: params.teamId,
      fleetId: params.fleetId,
      from: params.from,
      to: params.to,
      limit: params.limit.toString(),
      offset: params.offset.toString(),
      ...(params.chainId && { chainId: params.chainId.toString() }),
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data;
}

type GetFleetTransactionsSummaryParams = {
  teamId: string;
  fleetId: string;
  from: string;
  to: string;
};

/**
 * Fetches fleet transactions summary from the analytics service.
 */
export async function getFleetTransactionsSummary(
  params: GetFleetTransactionsSummaryParams,
) {
  const res = await analyticsServerProxy<{
    data: FleetTransactionsSummary;
  }>({
    method: "GET",
    pathname: "/v2/bundler/fleet-transactions/summary",
    searchParams: {
      teamId: params.teamId,
      fleetId: params.fleetId,
      from: params.from,
      to: params.to,
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data;
}
