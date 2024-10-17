"use client";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useUserOpUsageAggregate,
  useUserOpUsagePeriod,
  useWalletUsageAggregate,
  useWalletUsagePeriod,
} from "@3rdweb-sdk/react/hooks/useApi";
import { differenceInDays, format, subDays } from "date-fns";
import { useState } from "react";
import { ConnectAnalyticsDashboardUI } from "./ConnectAnalyticsDashboardUI";

export function ConnectAnalyticsDashboard(props: {
  clientId: string;
}) {
  const [range, setRange] = useState<Range>(() =>
    getLastNDaysRange("last-120"),
  );

  // use date-fns to calculate the number of days in the range
  const daysInRange = differenceInDays(range.to, range.from);

  const [intervalType, setIntervalType] = useState<"day" | "week">(
    daysInRange > 30 ? "week" : "day",
  );

  const walletUsageQuery = useWalletUsagePeriod({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
    period: intervalType,
  });

  const walletUsageAggregateQuery = useWalletUsageAggregate({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
  });

  const userOpUsageQuery = useUserOpUsagePeriod({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
    period: intervalType,
  });

  const userOpUsageAggregateQuery = useUserOpUsageAggregate({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
  });

  return (
    <div>
      <div className="flex gap-3">
        <DateRangeSelector
          range={range}
          setRange={(newRange) => {
            setRange(newRange);
            const days = differenceInDays(newRange.to, newRange.from);
            setIntervalType(days > 30 ? "week" : "day");
          }}
        />
        <IntervalSelector
          intervalType={intervalType}
          setIntervalType={setIntervalType}
        />
      </div>
      <div className="h-4" />
      <ConnectAnalyticsDashboardUI
        walletUsage={walletUsageQuery.data || []}
        aggregateWalletUsage={walletUsageAggregateQuery.data || []}
        userOpUsage={userOpUsageQuery.data || []}
        aggregateUserOpUsage={userOpUsageAggregateQuery.data || []}
        isPending={
          walletUsageQuery.isPending || walletUsageAggregateQuery.isPending
        }
      />
    </div>
  );
}

const durationPresets = [
  {
    name: "Last 7 Days",
    id: "last-7",
    days: 7,
  },
  {
    name: "Last 30 Days",
    id: "last-30",
    days: 30,
  },
  {
    name: "Last 60 Days",
    id: "last-60",
    days: 60,
  },
  {
    name: "Last 120 Days",
    id: "last-120",
    days: 120,
  },
] as const;

type DurationId = (typeof durationPresets)[number]["id"];

type Range = {
  type: DurationId | "custom";
  label?: string;
  from: Date;
  to: Date;
};

function getLastNDaysRange(id: DurationId) {
  const durationInfo = durationPresets.find((preset) => preset.id === id);
  if (!durationInfo) {
    throw new Error("Invalid duration id");
  }

  const todayDate = new Date();

  const value: Range = {
    type: id,
    from: subDays(todayDate, durationInfo.days),
    to: todayDate,
    label: durationInfo.name,
  };

  return value;
}

function DateRangeSelector(props: {
  range: Range;
  setRange: (range: Range) => void;
}) {
  const { range, setRange } = props;

  return (
    <DatePickerWithRange
      from={range.from}
      to={range.to}
      setFrom={(from) =>
        setRange({
          from,
          to: range.to,
          type: "custom",
        })
      }
      setTo={(to) =>
        setRange({
          from: range.from,
          to,
          type: "custom",
        })
      }
      header={
        <div className="mb-2 border-border border-b p-4">
          <Select
            value={range.type}
            onValueChange={(id: DurationId) => {
              setRange(getLastNDaysRange(id));
            }}
          >
            <SelectTrigger className="flex bg-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {durationPresets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}

              {range.type === "custom" && (
                <SelectItem value="custom">
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      }
      labelOverride={range.label}
      className="w-auto"
    />
  );
}

function IntervalSelector(props: {
  intervalType: "day" | "week";
  setIntervalType: (intervalType: "day" | "week") => void;
}) {
  return (
    <Select
      value={props.intervalType}
      onValueChange={(value: "day" | "week") => {
        props.setIntervalType(value);
      }}
    >
      <SelectTrigger className="w-auto hover:bg-muted">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="week"> Weekly </SelectItem>
        <SelectItem value="day"> Daily</SelectItem>
      </SelectContent>
    </Select>
  );
}
