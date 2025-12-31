import "server-only";
import {
  getAggregateUserOpUsage,
  getEOAAndInAppWalletConnections,
  getRpcUsageByType,
} from "@/api/analytics";

export type YearInReviewStats = {
  totalRpcRequests: number;
  totalWalletConnections: number;
  totalMainnetSponsoredTransactions: number;
  year: number;
};

/**
 * Get year-in-review statistics for the current user across all their teams
 * Hardcoded to 2025 (Jan 1, 2025 - Dec 31, 2025)
 */
export async function getYearInReview(
  authToken: string,
  teamIds: string[],
): Promise<YearInReviewStats> {
  const year = 2025;

  if (!authToken || teamIds.length === 0) {
    return {
      totalRpcRequests: 0,
      totalWalletConnections: 0,
      totalMainnetSponsoredTransactions: 0,
      year,
    };
  }

  // Hardcoded to 2025: Jan 1, 2025 - Dec 31, 2025
  const yearStart = new Date(2025, 0, 1);
  const yearEnd = new Date(2025, 11, 31, 23, 59, 59, 999);

  // Fetch all data in parallel across all teams
  const [rpcRequests, walletConnections, sponsoredTxs] = await Promise.all([
    // Get total RPC requests across all teams
    getTotalRpcRequests(teamIds, authToken, yearStart, yearEnd),
    // Get total wallet connections across all teams
    getTotalWalletConnections(teamIds, authToken, yearStart, yearEnd),
    // Get total mainnet sponsored transactions across all teams
    getTotalMainnetSponsoredTransactions(
      teamIds,
      authToken,
      yearStart,
      yearEnd,
    ),
  ]);

  return {
    totalRpcRequests: rpcRequests,
    totalWalletConnections: walletConnections,
    totalMainnetSponsoredTransactions: sponsoredTxs,
    year,
  };
}

async function getTotalRpcRequests(
  teamIds: string[],
  authToken: string,
  from: Date,
  to: Date,
): Promise<number> {
  try {
    // Aggregate RPC requests across all teams using the same API as analytics
    const requests = await Promise.all(
      teamIds.map(async (teamId) => {
        try {
          // Use getRpcUsageByType without projectId to get team-level data
          // This matches the format used in the analytics pages
          const usageData = await getRpcUsageByType(
            {
              teamId,
              from,
              to,
              period: "all",
            },
            authToken,
          );

          // Sum up all counts from the usage data
          return usageData.reduce((sum, item) => sum + (item.count || 0), 0);
        } catch (error) {
          console.error(`Failed to fetch RPC usage for team ${teamId}:`, error);
          return 0;
        }
      }),
    );

    return requests.reduce((sum, count) => sum + count, 0);
  } catch (error) {
    console.error("Failed to fetch RPC requests:", error);
    return 0;
  }
}

async function getTotalWalletConnections(
  teamIds: string[],
  authToken: string,
  from: Date,
  to: Date,
): Promise<number> {
  try {
    // Aggregate wallet connections across all teams
    const connections = await Promise.all(
      teamIds.map(async (teamId) => {
        const walletStats = await getEOAAndInAppWalletConnections(
          {
            teamId,
            from,
            to,
            period: "all",
          },
          authToken,
        );

        // Sum unique wallets connected (for "onboarded users" metric)
        // Note: With period: "all", this should be a single aggregated stat,
        // but we sum in case there are multiple stats (e.g., by wallet type)
        return walletStats.reduce(
          (sum, stat) => sum + (stat.uniqueWalletsConnected || 0),
          0,
        );
      }),
    );

    return connections.reduce((sum, count) => sum + count, 0);
  } catch (error) {
    console.error("Failed to fetch wallet connections:", error);
    return 0;
  }
}

async function getTotalMainnetSponsoredTransactions(
  teamIds: string[],
  authToken: string,
  from: Date,
  to: Date,
): Promise<number> {
  try {
    // Aggregate mainnet sponsored transactions across all teams
    // getAggregateUserOpUsage filters out testnets automatically
    const transactions = await Promise.all(
      teamIds.map(async (teamId) => {
        const aggregateStats = await getAggregateUserOpUsage(
          {
            teamId,
            from,
            to,
          },
          authToken,
        );

        return aggregateStats.successful || 0;
      }),
    );

    return transactions.reduce((sum, count) => sum + count, 0);
  } catch (error) {
    console.error("Failed to fetch mainnet sponsored transactions:", error);
    return 0;
  }
}
