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
  isLoading?: boolean;
};

function processQuery(
  volumeQuery: ReturnType<typeof usePayVolume>,
): ProcessedQuery {
  if (volumeQuery.isLoading) {
    return { isLoading: true };
  }

  if (volumeQuery.isError) {
    return { isError: true };
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
          color: "#6366f1",
        },
        {
          name: "Fiat",
          amount: queryData.fiatTotalUSD,
          color: "#d946ef",
        },
      ]
    : skeletonData;

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-center">
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
          <div className="flex flex-col gap-1 items-center">
            <p className="text-sm font-medium"> Total Volume</p>

            <SkeletonContainer
              loadedData={
                queryData
                  ? `$${queryData?.totalAmount.toLocaleString()}`
                  : props.query.isEmpty
                    ? "NA"
                    : undefined
              }
              skeletonData={"$100"}
              render={(totalAmount) => {
                return (
                  <p
                    className={cn(
                      "text-3xl font-semibold tracking-tighter",
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
      <div className="lg:flex items-center border-t border-border pt-5 lg:pt-0 lg:border-none lg:pr-10">
        <div className="flex lg:flex-col gap-10 lg:gap-4 justify-center">
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
        className="size-5 rounded mt-1"
        style={{
          background: props.color,
        }}
      />
      <div>
        <p className="text-secondary-foreground font-medium mb-1">
          {props.label}
        </p>

        <SkeletonContainer
          loadedData={props.amount}
          skeletonData={"$50"}
          render={(amount) => {
            return (
              <p className="text-2xl text-foreground font-semibold tracking-tight">
                {amount}
              </p>
            );
          }}
        />
      </div>
    </div>
  );
}
