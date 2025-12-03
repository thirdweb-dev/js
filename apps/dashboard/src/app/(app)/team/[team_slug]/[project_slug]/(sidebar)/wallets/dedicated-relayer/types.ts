/**
 * Represents a dedicated relayer fleet configuration.
 * Fleet config is fetched from ProjectBundlerService.fleet (service-utils).
 */
export type Fleet = {
  id: string;
  chainIds: number[];
  executors: string[]; // executor wallet addresses
};

/**
 * Fleet status based on its state.
 */
export type FleetStatus = "not-purchased" | "pending-setup" | "active";

/**
 * Derives the fleet status from the fleet object.
 */
export function getFleetStatus(fleet: Fleet | null): FleetStatus {
  if (!fleet) {
    return "not-purchased";
  }
  if (fleet.executors.length === 0) {
    return "pending-setup";
  }
  return "active";
}

/**
 * A single transaction from the fleet.
 */
export type FleetTransaction = {
  timestamp: string;
  chainId: string;
  transactionFee: number;
  transactionFeeUsd: number;
  walletAddress: string;
  transactionHash: string;
  userOpHash: string;
  executorAddress: string;
};

/**
 * Summary statistics for fleet transactions.
 */
export type FleetTransactionsSummary = {
  totalTransactions: number;
  totalGasSpentUsd: number;
  transactionsByChain: {
    chainId: string;
    count: number;
    gasSpentUsd: number;
  }[];
};

/**
 * Build the fleet ID from team and project.
 */
export function buildFleetId(teamId: string, projectId: string): string {
  return `fleet-${teamId}-${projectId}`;
}
