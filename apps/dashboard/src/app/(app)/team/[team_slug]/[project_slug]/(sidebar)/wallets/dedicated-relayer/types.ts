/**
 * Types for Dedicated Relayer (Fleet) feature.
 *
 * Fleet lifecycle:
 * - Not returned: empty state, dev hasn't purchased
 * - Returned with empty executors: pending setup state
 * - Returned with executors: fully active state
 */

export type FleetExecutor = {
  address: string;
  chainId: number;
};

export type FleetTier = "starter" | "growth" | "enterprise";

export type Fleet = {
  id: string;
  tier?: FleetTier;
  chainIds: number[];
  executors: FleetExecutor[];
  createdAt: string;
  updatedAt: string;
};

export type FleetAnalytics = {
  totalTransactions: number;
  totalGasSpentWei: string;
  remainingBalanceWei: string;
};

export type FleetStatus = "not-purchased" | "pending-setup" | "active";

export function getFleetStatus(fleet: Fleet | null | undefined): FleetStatus {
  if (!fleet) {
    return "not-purchased";
  }

  if (fleet.executors.length === 0) {
    return "pending-setup";
  }

  return "active";
}
