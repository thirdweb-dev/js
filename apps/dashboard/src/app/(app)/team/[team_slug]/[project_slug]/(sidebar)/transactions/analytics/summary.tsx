import { ActivityIcon, CoinsIcon } from "lucide-react";
import { toEther } from "thirdweb/utils";
import { StatCard } from "@/components/analytics/stat"; // Assuming correct path
import type { TransactionSummaryData } from "../lib/analytics";

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
        icon={ActivityIcon}
        // Value is a number, standard formatter works
        isPending={props.isPending}
        label="Total Transactions"
        value={props.data?.totalCount}
      />
      <StatCard
        formatter={(v: number) => `${v.toFixed(10)} ETH`}
        // If pending, value doesn't matter much.
        // If not pending, pass the wei string `as any` if data exists, otherwise pass 0.
        // Passing 0 ensures StatCard receives a number if data is missing post-loading.
        icon={CoinsIcon}
        isPending={props.isPending}
        label="Total Gas Spent (includes testnet)"
        // Pass the formatter that handles the type juggling
        value={
          props.isPending
            ? undefined
            : parseTotalGasCost(props.data?.totalGasCostWei ?? "0")
        }
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

export function TransactionAnalyticsSummary(props: {
  teamId: string;
  clientId: string;
  initialData: TransactionSummaryData | undefined;
}) {
  return (
    <TransactionAnalyticsSummaryUI data={props.initialData} isPending={false} />
  );
}
