"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { differenceInCalendarDays, format } from "date-fns";
import { ArrowUpIcon, InfoIcon } from "lucide-react";
import { ArrowDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
      className="border-none bg-background p-0"
      cardContentClassName="p-0"
      config={{
        price: {
          label: "Price",
          color: "hsl(var(--chart-1))",
        },
      }}
      data={data}
      isPending={props.isPending}
      chartClassName="aspect-[1.5] lg:aspect-[3]"
      hideLabel={false}
      toolTipLabelFormatter={getTooltipLabelFormatter(props.showTimeOfDay)}
      toolTipValueFormatter={(value) => {
        return tokenPriceUSDFormatter.format(value as number);
      }}
    />
  );
}

const tokenPriceUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 10,
  roundingMode: "halfEven",
  notation: "compact",
});

const marketCapFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  roundingMode: "halfEven",
  notation: "compact",
});

const holdersFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  notation: "compact",
});

const percentChangeFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
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
              skeletonData={10.0001}
              render={(v) => {
                return (
                  <p className="font-bold text-4xl tracking-tight">
                    {typeof v === "number"
                      ? tokenPriceUSDFormatter.format(v)
                      : v}
                  </p>
                );
              }}
            />
            <SkeletonContainer
              loadedData={percentChange24h}
              skeletonData={0.001}
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
                    variant={
                      isAlmostZero
                        ? "default"
                        : data > 0
                          ? "success"
                          : "destructive"
                    }
                    className="gap-2 text-sm"
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
            />
          </div>
        </div>

        <IntervalSelector interval={interval} setInterval={setInterval} />
      </div>

      <div className="h-4" />
      <PriceChartUI
        showTimeOfDay={interval === "24h"}
        isPending={tokenPriceQuery.isPending}
        data={filteredHistoricalPrices || []}
      />

      <div className="mt-8 flex gap-6 border-y border-dashed py-4 [&>*:not(:first-child)]:border-l [&>*:not(:first-child)]:border-dashed [&>*:not(:first-child)]:pl-5 [&>*]:grow">
        <TokenStat
          value={
            typeof marketCap === "number"
              ? marketCapFormatter.format(marketCap)
              : marketCap
          }
          skeletonData={"1000000000"}
          label="Market Cap"
          tooltip="Market capitalization is the total value of all tokens in circulation, calculated by multiplying the current price by the circulating supply"
        />

        <TokenStat
          skeletonData={"1000000000"}
          value={
            // show 0 value as N/A
            holders === 0
              ? "N/A"
              : typeof holders === "number"
                ? holdersFormatter.format(holders)
                : holders
          }
          label="Number of Holders"
          tooltip="The total number of unique wallet addresses that currently hold this token on the blockchain"
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
          skeletonData={props.skeletonData}
          loadedData={props.value}
          render={(v) => {
            return (
              <p className="font-semibold text-foreground text-xl tracking-tight">
                {v}
              </p>
            );
          }}
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
    "24h": "1D",
    "7d": "1W",
    "30d": "1M",
    "1y": "1Y",
    max: "MAX",
  };

  return (
    <div className="flex gap-2">
      {Object.entries(intervals).map(([key, value]) => (
        <Button
          key={key}
          variant="outline"
          className={cn(
            "rounded-full",
            props.interval === key && "border-active-border bg-accent",
          )}
          size="sm"
          onClick={() => props.setInterval(key as Interval)}
          tabIndex={0}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
