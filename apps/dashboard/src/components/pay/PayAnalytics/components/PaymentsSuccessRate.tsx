"use client";
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
import { useMemo } from "react";
import type { UniversalBridgeStats } from "types/analytics";
import { CardHeading } from "./common";

type PayVolumeType = "all" | "crypto" | "fiat";

export function PaymentsSuccessRate(props: {
  data: UniversalBridgeStats[];
}) {
  const [type, setType] = useState<PayVolumeType>("all");
  const isEmpty = useMemo(() => {
    return props.data.length === 0;
  }, [props.data]);
  const graphData = useMemo(() => {
    let succeeded = 0;
    let failed = 0;
    for (const item of props.data.filter(
      (x) =>
        type === "all" ||
        (type === "crypto" && x.type === "onchain") ||
        (type === "fiat" && x.type === "onramp"),
    )) {
      if (item.status === "completed") {
        succeeded += item.count;
      } else {
        failed += item.count;
      }
    }
    const total = succeeded + failed;
    if (total === 0) {
      return {
        succeeded: 0,
        failed: 0,
        rate: 0,
        total: 0,
      };
    }
    const rate = (succeeded / (succeeded + failed)) * 100;
    return {
      succeeded,
      failed,
      rate,
      total,
    };
  }, [props.data, type]);

  return (
    <div className="relative flex w-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <CardHeading> Payments </CardHeading>
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
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="h-10" />
        {isEmpty ? (
          <EmptyBar />
        ) : (
          <SkeletonContainer
            loadedData={graphData.rate}
            skeletonData={50}
            render={(rate) => <Bar rate={rate} />}
          />
        )}

        <div className="h-6" />

        <InfoRow
          label="Succeeded"
          type="success"
          amount={graphData.succeeded}
          isEmpty={isEmpty}
        />

        <div className="h-3" />

        <InfoRow
          label="Failed"
          type="failure"
          amount={graphData.failed}
          isEmpty={isEmpty}
        />
      </div>
    </div>
  );
}

function Bar(props: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5 overflow-hidden rounded-lg">
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
            ? "-"
            : props.amount !== undefined
              ? props.amount.toLocaleString()
              : undefined
        }
        skeletonData="50"
        render={(v) => {
          return <p className="font-medium text-base">{v}</p>;
        }}
      />
    </div>
  );
}
