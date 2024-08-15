import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Button } from "@/components/ui/button";
import { useTabHref } from "contract-ui/utils";
import {
  useAnalyticsSupportedForChain,
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
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  chainId,
  contractAddress,
  trackingCategory,
}) => {
  const analyticsSupported = useAnalyticsSupportedForChain(chainId);

  const trackEvent = useTrack();
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 14);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());

  const analyticsHref = useTabHref("analytics");

  if (!analyticsSupported.data) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        asChild
        className="absolute top-4 right-6 flex flex-row gap-1 items-center"
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
        <Link href={analyticsHref}>
          <span>View All</span>
          <ArrowRightIcon className="size-4" />
        </Link>
      </Button>

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
      title="Analytics"
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
