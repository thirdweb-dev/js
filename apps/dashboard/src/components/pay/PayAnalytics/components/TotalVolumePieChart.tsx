"use client";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart } from "recharts";
import { toUSD } from "../../../../utils/number";
import { chartHeight } from "./common";
import type { UniversalBridgeStats } from "types/analytics";

type VolData = {
  name: string;
  amount: number;
  color: string;
};

export function TotalVolumePieChart(props: {
  data: UniversalBridgeStats[];
}) {
  const data = props.data;
  const isEmpty =
    !data || data.length === 0 || data.every((x) => x.amountUsdCents === 0);
  const skeletonData: VolData[] = [
    {
      name: "Crypto",
      amount: 50,
      color: !isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
    },
    {
      name: "Fiat",
      amount: 50,
      color: !isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
    },
  ];

  const cryptoTotalUSD = data
    .filter((x) => x.type === "onchain")
    .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);
  const fiatTotalUSD = data
    .filter((x) => x.type === "onramp")
    .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);

  const volumeData: VolData[] = !isEmpty
    ? [
        {
          name: "Crypto",
          amount: cryptoTotalUSD,
          color: "hsl(var(--chart-1))",
        },
        {
          name: "Fiat",
          amount: fiatTotalUSD,
          color: "hsl(var(--chart-2))",
        },
      ]
    : skeletonData;

  return (
    <section className="w-full">
      <div className="flex flex-col justify-center gap-6 lg:flex-row">
        {/* Left */}
        <div className="relative flex justify-center">
          <PieChart width={250} height={chartHeight}>
            <Pie
              style={{
                outline: "none",
              }}
              activeIndex={0}
              data={volumeData}
              dataKey="amount"
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              stroke="none"
              cornerRadius={100}
              paddingAngle={5}
            >
              {volumeData.map((entry, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="flex flex-col items-center gap-1">
              <p className="font-medium text-sm"> Total Volume</p>

              <SkeletonContainer
                loadedData={
                  data && data.length > 0
                    ? toUSD(cryptoTotalUSD + fiatTotalUSD)
                    : undefined
                }
                skeletonData="$100"
                render={(totalAmount) => {
                  return (
                    <p
                      className={cn(
                        "font-semibold text-3xl tracking-tighter",
                        totalAmount.length > 6 ? "text-3xl" : "text-4xl",
                      )}
                    >
                      {totalAmount}
                    </p>
                  );
                }}
              />
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="items-center border-border border-t pt-5 lg:flex lg:border-none lg:pt-0 lg:pr-10">
          <div className="flex justify-center gap-10 lg:flex-col lg:gap-4">
            {volumeData.map((v) => (
              <VolumeLegend
                key={v.name}
                color={v.color}
                label={v.name}
                amount={
                  data && data.length > 0
                    ? toUSD(isEmpty ? 0 : v.amount)
                    : undefined
                }
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
          skeletonData="$50"
          render={(amount) => {
            return (
              <p className="font-semibold text-2xl text-foreground tracking-tight">
                {amount}
              </p>
            );
          }}
        />
      </div>
    </div>
  );
}
