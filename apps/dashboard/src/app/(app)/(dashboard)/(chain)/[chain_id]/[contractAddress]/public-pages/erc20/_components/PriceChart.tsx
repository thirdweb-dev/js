"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TokenPriceData } from "../_apis/token-price-data";

function PriceChartUI(props: {
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
      className="border-none bg-transparent p-0"
      config={{
        price: {
          color: "hsl(var(--chart-1))",
          label: "Price",
        },
      }}
      data={data}
      hideLabel={false}
      isPending={false}
      toolTipLabelFormatter={getTooltipLabelFormatter(props.showTimeOfDay)}
      toolTipValueFormatter={(value) => {
        return tokenPriceUSDFormatter.format(value as number);
      }}
    />
  );
}

const tokenPriceUSDFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 8,
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
  tokenPriceData: TokenPriceData;
}) {
  const [interval, setInterval] = useState<Interval>("max");

  const filteredHistoricalPrices = useMemo(() => {
    const currentDate = new Date();

    return params.tokenPriceData.historical_prices.filter((item) => {
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
  }, [params.tokenPriceData, interval]);

  const priceUsd = params.tokenPriceData.price_usd;
  const percentChange24h = params.tokenPriceData.percent_change_24h;
  const marketCap = params.tokenPriceData.market_cap_usd;
  const holders = params.tokenPriceData.holders;

  const formattedAbsChange = percentChangeFormatter.format(
    Math.abs(percentChange24h),
  );

  const isAlmostZeroChange =
    formattedAbsChange === percentChangeFormatter.format(0);

  const formattedPriceUSD = tokenPriceUSDFormatter.format(priceUsd);

  return (
    <div className="bg-card rounded-lg border">
      {/* price and change */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6">
        <div>
          <p className="mb-1 text-muted-foreground text-sm">Current Price</p>
          <div className="flex items-center gap-3">
            <p
              className={cn(
                "font-bold text-3xl lg:text-4xl tracking-tight",
                formattedPriceUSD.length > 8 && "text-2xl lg:text-4xl",
              )}
            >
              {typeof priceUsd === "number" ? formattedPriceUSD : priceUsd}
            </p>
            <Badge
              className="gap-2 lg:text-sm text-xs px-1.5"
              variant={
                isAlmostZeroChange
                  ? "default"
                  : percentChange24h > 0
                    ? "success"
                    : "destructive"
              }
            >
              <div className="flex items-center gap-0.5">
                {isAlmostZeroChange ? null : percentChange24h > 0 ? (
                  <ArrowUpIcon className="size-3" />
                ) : (
                  <ArrowDownIcon className="size-3" />
                )}
                <span>
                  {isAlmostZeroChange ? "~0%" : `${formattedAbsChange}%`}
                </span>
              </div>
              <span>(1d)</span>
            </Badge>
          </div>
        </div>

        <IntervalSelector interval={interval} setInterval={setInterval} />
      </div>

      <div className="px-0">
        <PriceChartUI
          data={filteredHistoricalPrices || []}
          showTimeOfDay={interval === "24h"}
        />
      </div>

      <div className="px-4 lg:px-6 py-4 mt-6 border-t border-dashed flex gap-6 [&>*:not(:first-child)]:border-l [&>*:not(:first-child)]:pl-5 [&>*]:grow">
        <TokenStat
          label="Market Cap"
          tooltip="Market capitalization is the total value of all tokens in circulation, calculated by multiplying the current price by the circulating supply"
          value={
            typeof marketCap === "number"
              ? marketCapFormatter.format(marketCap)
              : marketCap
          }
        />

        <TokenStat
          label="Number of Holders"
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

function TokenStat(props: {
  value: string | number;
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
        <p className="font-semibold text-foreground text-xl tracking-tight">
          {props.value}
        </p>
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
            "rounded-full px-2.5 py-1.5 h-auto bg-background text-xs lg:text-sm",
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
