"use client";
import { Cell, Pie, PieChart } from "recharts";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UniversalBridgeStats } from "@/types/analytics";
import { toUSD } from "@/utils/number";
import { chartHeight } from "./common";

type VolData = {
  name: string;
  amount: number;
  color: string;
};

export function TotalVolumePieChart(props: {
  data: UniversalBridgeStats[];
  hideTotal?: boolean;
}) {
  const data = props.data;
  const isEmpty =
    data.length === 0 || data.every((x) => x.amountUsdCents === 0);
  const skeletonData: VolData[] = [
    {
      amount: 50,
      color: !isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
      name: "Crypto",
    },
    {
      amount: 50,
      color: !isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
      name: "Fiat",
    },
  ];

  const cryptoTotalUSD = data
    .filter((x) => x.type === "onchain")
    .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);
  const fiatTotalUSD = data
    .filter((x) => x.type === "onramp")
    .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);

  const volumeData: VolData[] = [
    {
      amount: cryptoTotalUSD,
      color: "hsl(var(--chart-1))",
      name: "Crypto",
    },
    {
      amount: fiatTotalUSD,
      color: "hsl(var(--chart-2))",
      name: "Fiat",
    },
  ];

  const chartVolumeData = !isEmpty ? volumeData : skeletonData;

  return (
    <section className="w-full">
      <div className="flex flex-col justify-center gap-6 lg:flex-row">
        {/* Left */}
        <div className="relative flex justify-center">
          <PieChart height={chartHeight} width={250}>
            <Pie
              activeIndex={0}
              cornerRadius={100}
              cx="50%"
              cy="50%"
              data={chartVolumeData}
              dataKey="amount"
              innerRadius="80%"
              outerRadius="100%"
              paddingAngle={5}
              stroke="none"
              style={{
                outline: "none",
              }}
            >
              {chartVolumeData.map((entry, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <Cell fill={entry.color} key={index} />
              ))}
            </Pie>
          </PieChart>

          {!props.hideTotal && (
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <div className="flex flex-col items-center gap-1">
                <p className="font-medium text-sm text-muted-foreground">
                  Total Volume
                </p>

                <SkeletonContainer
                  loadedData={
                    !data
                      ? undefined
                      : data.length > 0
                        ? toUSD(cryptoTotalUSD + fiatTotalUSD)
                        : "NA"
                  }
                  render={(totalAmount) => {
                    return (
                      <p
                        className={cn(
                          "font-semibold text-2xl tracking-tighter",
                          totalAmount.length > 6 ? "text-2xl" : "text-3xl",
                        )}
                      >
                        {totalAmount}
                      </p>
                    );
                  }}
                  skeletonData="$100"
                />
              </div>
            </div>
          )}
        </div>
        {/* Right */}
        <div className="items-center border-border border-t pt-5 lg:flex lg:border-none lg:pt-0 lg:pr-10">
          <div className="flex justify-center gap-10 lg:flex-col lg:gap-4">
            {volumeData.map((v) => (
              <VolumeLegend
                amount={
                  isEmpty ? "NA" : data.length > 0 ? toUSD(v.amount) : "NA"
                }
                color={isEmpty ? "hsl(var(--muted))" : v.color}
                key={v.name}
                label={v.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VolumeLegend(props: {
  color: string;
  label: string;
  amount?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div
        className="mt-1 size-5 rounded"
        style={{
          background: props.color,
        }}
      />
      <div>
        <p className="mb-1 font-medium text-muted-foreground">{props.label}</p>

        <SkeletonContainer
          loadedData={props.amount}
          render={(amount) => {
            return (
              <p className="font-semibold text-2xl text-foreground tracking-tight">
                {amount}
              </p>
            );
          }}
          skeletonData="$50"
        />
      </div>
    </div>
  );
}
