"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTokenPriceData } from "../_hooks/useTokenPriceData";

function PriceChartUI(props: {
  isPending: boolean;
  showTimeOfDay: boolean;
  data: Array<{
    date: string;
    price_usd: number;
    price_usd_cents: number;
  }>;
}) {
  const data = props.data.map((item) => ({
    price: item.price_usd,
    time: new Date(item.date).getTime(),
  }));

  return (
    <ThirdwebAreaChart
      cardContentClassName="p-0"
      chartClassName="aspect-[1.5] lg:aspect-[3]"
      className="border-none bg-background p-0"
      config={{
        price: {
          color: "hsl(var(--chart-1))",
          label: "Price",
        },
      }}
      data={data}
      hideLabel={false}
      isPending={props.isPending}
      toolTipLabelFormatter={getTooltipLabelFormatter(props.showTimeOfDay)}
      toolTipValueFormatter={(value) => {
        return tokenPriceUSDFormatter.format(value as number);
      }}
    />
  );
}

const tokenPriceUSDFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 10,
  minimumFractionDigits: 0,
  notation: "compact",
  roundingMode: "halfEven",
  style: "currency",
});

const marketCapFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  notation: "compact",
  roundingMode: "halfEven",
  style: "currency",
});

const holdersFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  notation: "compact",
});

const percentChangeFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

function getTooltipLabelFormatter(includeTimeOfDay: boolean) {
  return (_v: string, item: unknown) => {
    if (Array.isArray(item)) {
      const time = item[0].payload.time as number;
      return format(
        new Date(time),
        includeTimeOfDay ? "MMM d, yyyy hh:mm a" : "MMM d, yyyy",
      );
    }
    return undefined;
  };
}

export function TokenStats(params: {
  chainId: number;
  contractAddress: string;
}) {
  const tokenPriceQuery = useTokenPriceData(params);
  const [interval, setInterval] = useState<Interval>("max");

  const tokenPriceData = tokenPriceQuery.data;

  const filteredHistoricalPrices = useMemo(() => {
    const currentDate = new Date();

    if (tokenPriceData?.type === "no-data") {
      return [];
    }

    return tokenPriceData?.data?.historical_prices.filter((item) => {
      const date = new Date(item.date);
      const maxDiff =
        interval === "24h"
          ? 1
          : interval === "7d"
            ? 7
            : interval === "30d"
              ? 30
              : interval === "1y"
                ? 365
                : Number.MAX_SAFE_INTEGER;

      return differenceInCalendarDays(currentDate, date) <= maxDiff;
    });
  }, [tokenPriceData, interval]);

  const priceUsd =
    tokenPriceData?.type === "no-data" || tokenPriceQuery.isError
      ? "N/A"
      : tokenPriceData?.data?.price_usd;

  const percentChange24h =
    tokenPriceData?.type === "no-data" || tokenPriceQuery.isError
      ? "N/A"
      : tokenPriceData?.data?.percent_change_24h;

  const marketCap =
    tokenPriceData?.type === "no-data" || tokenPriceQuery.isError
      ? "N/A"
      : tokenPriceData?.data?.market_cap_usd;

  const holders =
    tokenPriceData?.type === "no-data" || tokenPriceQuery.isError
      ? "N/A"
      : tokenPriceData?.data?.holders;

  return (
    <div>
      {/* price and change */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-muted-foreground text-sm">Current Price</p>
          <div className="flex items-center gap-2">
            <SkeletonContainer
              loadedData={priceUsd}
              render={(v) => {
                return (
                  <p className="font-bold text-4xl tracking-tight">
                    {typeof v === "number"
                      ? tokenPriceUSDFormatter.format(v)
                      : v}
                  </p>
                );
              }}
              skeletonData={10.0001}
            />
            <SkeletonContainer
              loadedData={percentChange24h}
              render={(data) => {
                if (typeof data === "string") {
                  return null;
                }

                const formattedAbsChange = percentChangeFormatter.format(
                  Math.abs(data),
                );

                const isAlmostZero =
                  formattedAbsChange === percentChangeFormatter.format(0);

                return (
                  <Badge
                    className="gap-2 text-sm"
                    variant={
                      isAlmostZero
                        ? "default"
                        : data > 0
                          ? "success"
                          : "destructive"
                    }
                  >
                    <div className="flex items-center gap-0.5">
                      {isAlmostZero ? null : data > 0 ? (
                        <ArrowUpIcon className="size-3" />
                      ) : (
                        <ArrowDownIcon className="size-3" />
                      )}
                      <span>
                        {isAlmostZero ? "~0%" : `${formattedAbsChange}%`}
                      </span>
                    </div>
                    <span>(1d)</span>
                  </Badge>
                );
              }}
              skeletonData={0.001}
            />
          </div>
        </div>

        <IntervalSelector interval={interval} setInterval={setInterval} />
      </div>

      <div className="h-4" />
      <PriceChartUI
        data={filteredHistoricalPrices || []}
        isPending={tokenPriceQuery.isPending}
        showTimeOfDay={interval === "24h"}
      />

      <div className="mt-8 flex gap-6 border-y border-dashed py-4 [&>*:not(:first-child)]:border-l [&>*:not(:first-child)]:border-dashed [&>*:not(:first-child)]:pl-5 [&>*]:grow">
        <TokenStat
          label="Market Cap"
          skeletonData={"1000000000"}
          tooltip="Market capitalization is the total value of all tokens in circulation, calculated by multiplying the current price by the circulating supply"
          value={
            typeof marketCap === "number"
              ? marketCapFormatter.format(marketCap)
              : marketCap
          }
        />

        <TokenStat
          label="Number of Holders"
          skeletonData={"1000000000"}
          tooltip="The total number of unique wallet addresses that currently hold this token on the blockchain"
          value={
            // show 0 value as N/A
            holders === 0
              ? "N/A"
              : typeof holders === "number"
                ? holdersFormatter.format(holders)
                : holders
          }
        />
      </div>
    </div>
  );
}

function TokenStat<T extends string | number>(props: {
  value: T | undefined;
  skeletonData: T;
  label: string;
  tooltip: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <p className="text-muted-foreground text-sm">{props.label}</p>
        <ToolTipLabel label={props.tooltip}>
          <InfoIcon className="size-3.5 text-muted-foreground" />
        </ToolTipLabel>
      </div>
      <div className="flex">
        <SkeletonContainer
          loadedData={props.value}
          render={(v) => {
            return (
              <p className="font-semibold text-foreground text-xl tracking-tight">
                {v}
              </p>
            );
          }}
          skeletonData={props.skeletonData}
        />
      </div>
    </div>
  );
}

type Interval = "24h" | "7d" | "30d" | "1y" | "max";

function IntervalSelector(props: {
  interval: Interval;
  setInterval: (timeframe: Interval) => void;
}) {
  const intervals: Record<Interval, string> = {
    "1y": "1Y",
    "7d": "1W",
    "24h": "1D",
    "30d": "1M",
    max: "MAX",
  };

  return (
    <div className="flex gap-2">
      {Object.entries(intervals).map(([key, value]) => (
        <Button
          className={cn(
            "rounded-full",
            props.interval === key && "border-active-border bg-accent",
          )}
          key={key}
          onClick={() => props.setInterval(key as Interval)}
          size="sm"
          tabIndex={0}
          variant="outline"
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
