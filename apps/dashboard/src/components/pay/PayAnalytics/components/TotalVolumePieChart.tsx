import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart } from "recharts";
import { usePayVolume } from "../hooks/usePayVolume";
import { FailedToLoad, chartHeight } from "./common";

type VolData = {
  name: string;
  amount: number;
  color: string;
};

type ProcessedQuery = {
  data?: {
    totalAmount: number;
    cryptoTotalUSD: number;
    fiatTotalUSD: number;
  };
  isError?: boolean;
  isEmpty?: boolean;
  isPending?: boolean;
};

function processQuery(
  volumeQuery: ReturnType<typeof usePayVolume>,
): ProcessedQuery {
  if (volumeQuery.isPending) {
    return { isPending: true };
  }

  if (volumeQuery.isError) {
    return { isError: true };
  }
  if (!volumeQuery.data) {
    return { isEmpty: true };
  }

  if (volumeQuery.data.aggregate.sum.succeeded.amountUSDCents === 0) {
    return { isEmpty: true };
  }

  const cryptoTotalUSD = Math.ceil(
    volumeQuery.data.aggregate.buyWithCrypto.succeeded.amountUSDCents / 100,
  );
  const fiatTotalUSD = Math.ceil(
    volumeQuery.data.aggregate.buyWithFiat.succeeded.amountUSDCents / 100,
  );

  const totalAmount = cryptoTotalUSD + fiatTotalUSD;

  return {
    data: {
      totalAmount,
      cryptoTotalUSD,
      fiatTotalUSD,
    },
  };
}

export function TotalVolumePieChart(props: {
  clientId: string;
  from: Date;
  to: Date;
}) {
  const uiQuery = processQuery(
    usePayVolume({
      clientId: props.clientId,
      from: props.from,
      intervalType: "day",
      to: props.to,
    }),
  );

  return (
    <section className="w-full">
      {!uiQuery.isError ? <RenderData query={uiQuery} /> : <FailedToLoad />}
    </section>
  );
}

function RenderData(props: { query: ProcessedQuery }) {
  const queryData = props.query.data;

  const skeletonData: VolData[] = [
    {
      name: "Crypto",
      amount: 50,
      color: props.query.isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
    },
    {
      name: "Fiat",
      amount: 50,
      color: props.query.isEmpty ? "hsl(var(--accent))" : "hsl(var(--muted))",
    },
  ];

  const volumeData: VolData[] = queryData
    ? [
        {
          name: "Crypto",
          amount: queryData.cryptoTotalUSD,
          color: "hsl(var(--chart-1))",
        },
        {
          name: "Fiat",
          amount: queryData.fiatTotalUSD,
          color: "hsl(var(--chart-2))",
        },
      ]
    : skeletonData;

  return (
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
                queryData
                  ? `$${queryData?.totalAmount.toLocaleString()}`
                  : props.query.isEmpty
                    ? "NA"
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
                queryData
                  ? `$${v.amount.toLocaleString()}`
                  : props.query.isEmpty
                    ? "$-"
                    : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
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
