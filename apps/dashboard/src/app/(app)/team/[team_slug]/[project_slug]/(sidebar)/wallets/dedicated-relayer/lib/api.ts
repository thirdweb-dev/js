"use server";

import { analyticsServerProxy } from "@/actions/proxies";
import { getProject } from "@/api/project/projects";
import {
  buildFleetId,
  type Fleet,
  type FleetTransaction,
  type FleetTransactionsSummary,
} from "../types";

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

/**
 * Fetches the current fleet status for a project.
 */
export async function getFleetStatus(
  teamSlug: string,
  projectSlug: string,
): Promise<Fleet | null> {
  const project = await getProject(teamSlug, projectSlug);
  if (!project) return null;

  const bundlerService = project.services.find((s) => s.name === "bundler");
  const fleetConfig =
    bundlerService && "dedicatedRelayer" in bundlerService
      ? (bundlerService.dedicatedRelayer as {
          sku: string;
          chainIds: number[];
          executors: string[];
        } | null)
      : null;

  if (fleetConfig) {
    return {
      id: buildFleetId(project.teamId, project.id),
      chainIds: fleetConfig.chainIds,
      executors: fleetConfig.executors,
    };
  }
  return null;
}
