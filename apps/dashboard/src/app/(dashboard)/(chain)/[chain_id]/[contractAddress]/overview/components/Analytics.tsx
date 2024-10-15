import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Button } from "@/components/ui/button";
import {
  useLogsAnalytics,
  useTransactionAnalytics,
  useUniqueWalletsAnalytics,
} from "data/analytics/hooks";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface AnalyticsOverviewProps {
  chainId: number;
  contractAddress: string;
  trackingCategory: string;
  chainSlug: string;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  chainId,
  contractAddress,
  trackingCategory,
  chainSlug,
}) => {
  const trackEvent = useTrack();
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 14);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-2xl tracking-tight">Analytics</h2>
        <Button
          asChild
          className="gap-1"
          size="sm"
          variant="outline"
          onClick={() => {
            trackEvent({
              category: trackingCategory,
              action: "click",
              label: "view_all_analytics",
            });
          }}
        >
          <Link href={`/${chainSlug}/${contractAddress}/analytics`}>
            <span>View All</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <OverviewAnalytics
        chainId={chainId}
        contractAddress={contractAddress}
        endDate={endDate}
        startDate={startDate}
      />
    </div>
  );
};

type ChartProps = {
  contractAddress: string;
  chainId: number;
  startDate: Date;
  endDate: Date;
};

function OverviewAnalytics(props: ChartProps) {
  const wallets = useUniqueWalletsAnalytics(props);
  const transactions = useTransactionAnalytics(props);
  const events = useLogsAnalytics(props);

  const mergedData = useMemo(() => {
    const time = (wallets.data || transactions.data || events.data || []).map(
      (wallet) => wallet.time,
    );

    return time.map((time) => {
      const wallet = wallets.data?.find((wallet) => wallet.time === time);
      const transaction = transactions.data?.find(
        (transaction) => transaction.time === time,
      );
      const event = events.data?.find((event) => event.time === time);

      return {
        time,
        wallets: wallet?.wallets || 0,
        transactions: transaction?.count || 0,
        events: event?.count || 0,
      };
    });
  }, [wallets.data, transactions.data, events.data]);

  return (
    <ThirdwebAreaChart
      config={{
        wallets: {
          label: "Unique Wallets",
          color: "hsl(var(--chart-1))",
        },
        transactions: {
          label: "Total Transactions",
          color: "hsl(var(--chart-2))",
        },
        events: {
          label: "Total Events",
          color: "hsl(var(--chart-3))",
        },
      }}
      data={mergedData}
      showLegend
      chartClassName="aspect[2] lg:aspect-[4.5]"
    />
  );
}
