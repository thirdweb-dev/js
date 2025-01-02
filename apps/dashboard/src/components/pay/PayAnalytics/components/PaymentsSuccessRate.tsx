import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePayVolume } from "../hooks/usePayVolume";
import { CardHeading, FailedToLoad } from "./common";

type PayVolumeType = "all" | "crypto" | "fiat";

type UIData = {
  succeeded: number;
  failed: number;
  rate: number;
  total: number;
};

type ProcessedQuery = {
  data?: UIData;
  isError?: boolean;
  isPending?: boolean;
  isEmpty?: boolean;
};

function processQuery(
  volumeQuery: ReturnType<typeof usePayVolume>,
  type: PayVolumeType,
): ProcessedQuery {
  if (volumeQuery.isPending) {
    return { isPending: true };
  }

  if (volumeQuery.isError) {
    return { isError: true };
  }

  const aggregated = volumeQuery.data?.aggregate;
  if (!aggregated) {
    return {
      isEmpty: true,
    };
  }

  let succeeded = 0;
  let failed = 0;

  switch (type) {
    case "all": {
      succeeded = aggregated.sum.succeeded.count;
      failed = aggregated.sum.failed.count;
      break;
    }

    case "crypto": {
      succeeded = aggregated.buyWithCrypto.succeeded.count;
      failed = aggregated.buyWithCrypto.failed.count;
      break;
    }

    case "fiat": {
      succeeded = aggregated.buyWithFiat.succeeded.count;
      failed = aggregated.buyWithFiat.failed.count;
      break;
    }

    default: {
      throw new Error("Invalid tab");
    }
  }

  const total = succeeded + failed;

  if (total === 0) {
    return {
      isEmpty: true,
    };
  }

  const rate = (succeeded / (succeeded + failed)) * 100;
  const data = { succeeded, failed, rate, total };

  return { data };
}

export function PaymentsSuccessRate(props: {
  clientId: string;
  from: Date;
  to: Date;
}) {
  const [type, setType] = useState<PayVolumeType>("all");

  const uiQuery = processQuery(
    usePayVolume({
      clientId: props.clientId,
      from: props.from,
      to: props.to,
      intervalType: "day",
    }),
    type,
  );

  return (
    <div className="relative flex w-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <CardHeading> Payments </CardHeading>
        {!uiQuery.isPending && (
          <Select
            value={type}
            onValueChange={(value: PayVolumeType) => {
              setType(value);
            }}
          >
            <SelectTrigger className="w-auto bg-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Total</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="fiat">Fiat</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {!uiQuery.isError ? <RenderData query={uiQuery} /> : <FailedToLoad />}
      </div>
    </div>
  );
}

function RenderData(props: { query: ProcessedQuery }) {
  return (
    <div>
      <div className="h-10" />
      {props.query.isEmpty ? (
        <EmptyBar />
      ) : (
        <SkeletonContainer
          loadedData={props.query.data?.rate}
          skeletonData={50}
          render={(rate) => <Bar rate={rate} />}
        />
      )}

      <div className="h-6" />

      <InfoRow
        label="Succeeded"
        type="success"
        amount={props.query.data?.succeeded}
        isEmpty={props.query.isEmpty}
      />

      <div className="h-3" />

      <InfoRow
        label="Failed"
        type="failure"
        amount={props.query.data?.failed}
        isEmpty={props.query.isEmpty}
      />
    </div>
  );
}

function Bar(props: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <ToolTipLabel label="Succeeded">
        <div
          className="h-5 rounded-lg rounded-r-none border-r-0 bg-success-text transition-all"
          style={{
            width: `${props.rate}%`,
          }}
        />
      </ToolTipLabel>
      <ToolTipLabel label="Failed">
        <div className="h-5 flex-1 rounded-lg rounded-l-none border-l-0 bg-destructive-text transition-all" />
      </ToolTipLabel>
    </div>
  );
}

function EmptyBar() {
  return <div className="flex h-5 items-center gap-0.5 rounded-lg bg-accent" />;
}

function InfoRow(props: {
  label: string;
  type: "success" | "failure";
  amount?: number;
  isEmpty?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div
          className={cn("size-5 rounded-lg", {
            "bg-accent": props.amount === undefined,
            "bg-success-text":
              props.amount !== undefined && props.type === "success",
            "bg-destructive-text":
              props.amount !== undefined && props.type === "failure",
          })}
        />
        <p className="text-base text-muted-foreground">{props.label}</p>
      </div>
      <SkeletonContainer
        loadedData={
          props.isEmpty
            ? "$-"
            : props.amount !== undefined
              ? `$${props.amount.toLocaleString()}`
              : undefined
        }
        skeletonData="$50"
        render={(v) => {
          return <p className="font-medium text-base">{v}</p>;
        }}
      />
    </div>
  );
}
