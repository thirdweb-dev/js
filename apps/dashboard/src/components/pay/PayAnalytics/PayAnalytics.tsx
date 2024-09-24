"use client";

import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { PayCustomersTable } from "./components/PayCustomersTable";
import { PayNewCustomers } from "./components/PayNewCustomers";
import { PaymentHistory } from "./components/PaymentHistory";
import { PaymentsSuccessRate } from "./components/PaymentsSuccessRate";
import { Payouts } from "./components/Payouts";
import { TotalPayVolume } from "./components/TotalPayVolume";
import { TotalVolumePieChart } from "./components/TotalVolumePieChart";

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

export function PayAnalytics(props: { clientId: string }) {
  const clientId = props.clientId;
  const [range, setRange] = useState<Range>(() =>
    getLastNDaysRange("last-120"),
  );

  const numberOfDays = Math.round(
    (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div>
      <div className="mb-2 flex">
        <Filters range={range} setRange={setRange} />
      </div>
      <div className="flex flex-col gap-10 lg:gap-4">
        <GridWithSeparator>
          <div className="flex items-center border-border border-b pb-6 xl:border-none xl:pb-0">
            <TotalVolumePieChart
              clientId={clientId}
              from={range.from}
              to={range.to}
            />
          </div>
          <TotalPayVolume
            clientId={clientId}
            from={range.from}
            to={range.to}
            numberOfDays={numberOfDays}
          />
        </GridWithSeparator>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 ">
          <CardContainer>
            <Payouts
              clientId={clientId}
              from={range.from}
              to={range.to}
              numberOfDays={numberOfDays}
            />
          </CardContainer>
          <CardContainer>
            <PaymentsSuccessRate
              clientId={clientId}
              from={range.from}
              to={range.to}
            />
          </CardContainer>
        </div>

        <GridWithSeparator>
          <div className="border-border border-b pb-6 xl:border-none xl:pb-0">
            <PayNewCustomers
              clientId={clientId}
              from={range.from}
              to={range.to}
              numberOfDays={numberOfDays}
            />
          </div>
          <PayCustomersTable
            clientId={clientId}
            from={range.from}
            to={range.to}
          />
        </GridWithSeparator>

        <CardContainer>
          <PaymentHistory clientId={clientId} from={range.from} to={range.to} />
        </CardContainer>
      </div>
    </div>
  );
}

function getLastNDaysRange(id: DurationId) {
  const todayDate = new Date();
  const pastDate = new Date(todayDate);

  const durationInfo = durationPresets.find((preset) => preset.id === id);
  if (!durationInfo) {
    throw new Error("Invalid duration id");
  }

  pastDate.setDate(todayDate.getDate() - durationInfo.days);

  const value: Range = {
    type: id,
    from: pastDate,
    to: todayDate,
    label: durationInfo.name,
  };

  return value;
}

function Filters(props: { range: Range; setRange: (range: Range) => void }) {
  const { range, setRange } = props;

  const presets = (
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
  );

  return (
    <div className="flex gap-2">
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
        header={presets}
        labelOverride={range.label}
        className="w-auto border-none p-0"
      />
    </div>
  );
}

function GridWithSeparator(props: { children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 gap-6 rounded-xl border border-border p-4 lg:gap-12 xl:grid-cols-2 xl:p-6">
      {props.children}
      {/* Desktop - horizontal middle */}
      <div className="absolute top-6 bottom-6 left-[50%] hidden w-[1px] bg-border xl:block" />
    </div>
  );
}

function CardContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex rounded-xl border border-border p-4 xl:p-6">
      {props.children}
    </div>
  );
}
