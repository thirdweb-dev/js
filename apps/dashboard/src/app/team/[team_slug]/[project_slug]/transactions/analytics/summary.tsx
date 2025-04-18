import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import { getAuthToken } from "app/api/lib/getAuthToken";
import { StatCard } from "components/analytics/stat"; // Assuming correct path
import { ActivityIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
// Import the specific utility function needed
import { toEther } from "thirdweb/utils";

// Define the structure of the data we expect back from our fetch function
type TransactionSummaryData = {
  totalCount: number;
  totalGasCostWei: string;
  totalGasUnitsUsed: string; // Keep fetched data structure
};

// Define the structure of the API response
type AnalyticsSummaryApiResponse = {
  result: {
    summary: {
      totalCount: number;
      totalGasCostWei: string;
      totalGasUnitsUsed: string;
    };
    metadata: {
      startDate?: string;
      endDate?: string;
    };
  };
};

// Fetches data from the /analytics-summary endpoint
async function getTransactionAnalyticsSummary(props: {
  teamId: string;
  clientId: string;
}): Promise<TransactionSummaryData> {
  const authToken = await getAuthToken();
  const body = {};
  const defaultData: TransactionSummaryData = {
    totalCount: 0,
    totalGasCostWei: "0",
    totalGasUnitsUsed: "0",
  };

  try {
    const response = await fetch(
      `${THIRDWEB_ENGINE_CLOUD_URL}/project/transactions/analytics-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-team-id": props.teamId,
          "x-client-id": props.clientId,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized fetching transaction summary");
        return defaultData;
      }
      const errorText = await response.text();
      throw new Error(
        `Error fetching transaction summary: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as AnalyticsSummaryApiResponse;

    return {
      totalCount: data.result.summary.totalCount ?? 0,
      totalGasCostWei: data.result.summary.totalGasCostWei ?? "0",
      totalGasUnitsUsed: data.result.summary.totalGasUnitsUsed ?? "0",
    };
  } catch (error) {
    console.error("Failed to fetch transaction summary:", error);
    return defaultData;
  }
}

// Renders the UI based on fetched data or pending state
function TransactionAnalyticsSummaryUI(props: {
  data: TransactionSummaryData | undefined;
  isPending: boolean;
}) {
  // Formatter function specifically for the StatCard prop
  // Typed to accept number for StatCard's prop type, but receives the string via `as any`
  const parseTotalGasCost = (valueFromCard: string): number => {
    // At runtime, valueFromCard is the string passed via `as any` if data exists,
    // or potentially the fallback number (like 0) if data doesn't exist.
    // We prioritize the actual string from props.data if available.
    const weiString = props.data?.totalGasCostWei ?? "0";

    // Check if the effective value is zero
    if (weiString === "0") {
      return 0;
    }

    try {
      // Convert the definitive wei string to BigInt
      const weiBigInt = BigInt(weiString);
      // Use the imported toEther function
      return Number.parseFloat(toEther(weiBigInt));
    } catch (e) {
      // Catch potential errors during BigInt conversion or formatting
      console.error("Error formatting wei value:", weiString, e);
      // Check if the value passed from card was actually the fallback number
      if (typeof valueFromCard === "number" && valueFromCard === 0) {
        return 0; // If fallback 0 was passed, display 0
      }
    }
    return 0;
  };

  // NOTE: props.data?.totalGasUnitsUsed is fetched but not currently displayed.

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StatCard
        label="Total Transactions"
        // Value is a number, standard formatter works
        value={props.data?.totalCount}
        icon={ActivityIcon}
        isPending={props.isPending}
      />
      <StatCard
        label="Total Gas Spent (includes testnet)"
        // If pending, value doesn't matter much.
        // If not pending, pass the wei string `as any` if data exists, otherwise pass 0.
        // Passing 0 ensures StatCard receives a number if data is missing post-loading.
        value={
          props.isPending
            ? undefined
            : parseTotalGasCost(props.data?.totalGasCostWei ?? "0")
        }
        formatter={(v: number) => `${v.toFixed(10)} ETH`}
        icon={CoinsIcon}
        // Pass the formatter that handles the type juggling
        isPending={props.isPending}
      />
      {/*
      // Example of how totalGasUnitsUsed could be added later:
      <StatCard
        label="Total Gas Units Used"
        value={(props.isPending ? undefined : (props.data?.totalGasUnitsUsed ?? 0)) as any} // Pass string as any
        icon={SomeOtherIcon}
        isPending={props.isPending}
        formatter={(value: number) => { // Formatter receives string via `as any`
          const unitString = props.data?.totalGasUnitsUsed ?? '0';
          if (unitString === '0') return '0';
          try {
            return new Intl.NumberFormat("en-US").format(BigInt(unitString));
          } catch {
            return "Error";
          }
        }}
      />
      */}
    </div>
  );
}

// Fetches data and renders the UI component
async function AsyncTransactionsAnalyticsSummary(props: {
  teamId: string;
  clientId: string;
}) {
  const data = await getTransactionAnalyticsSummary({
    teamId: props.teamId,
    clientId: props.clientId,
  });
  return <TransactionAnalyticsSummaryUI data={data} isPending={false} />;
}

// Main component: Shows loading state (Suspense fallback) while fetching data
export function TransactionAnalyticsSummary(props: {
  teamId: string;
  clientId: string;
}) {
  return (
    <Suspense
      fallback={
        <TransactionAnalyticsSummaryUI data={undefined} isPending={true} />
      }
    >
      <AsyncTransactionsAnalyticsSummary
        teamId={props.teamId}
        clientId={props.clientId}
      />
    </Suspense>
  );
}
