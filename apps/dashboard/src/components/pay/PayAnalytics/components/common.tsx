import { Badge } from "@/components/ui/badge";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { ArrowDownIcon, ArrowUpIcon, OctagonXIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FailedToLoad() {
  return (
    <div className="min-h-[250px] flex items-center justify-center flex-1">
      <div className="flex items-center gap-2">
        <OctagonXIcon className="size-5 text-destructive-foreground" />
        <p className="text-muted-foreground">Unable to load</p>
      </div>
    </div>
  );
}

export function NoDataOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm text-muted-foreground bg-background/30 text-sm rounded-lg">
      No data available
    </div>
  );
}

export function CardHeading(props: { children: React.ReactNode }) {
  return <h3 className="text-base font-medium">{props.children}</h3>;
}

export function ChangeBadge(props: { percent: number }) {
  const percentValue = `${props.percent.toFixed(0)}%`;
  let label = "No change compared to prior range";
  if (props.percent !== 0) {
    label = `
      ${props.percent >= 0 ? "Increase" : "Decrease"} of ${percentValue} compared to prior range
    `;
  }
  return (
    <ToolTipLabel label={label}>
      <div>
        <Badge
          variant={props.percent >= 0 ? "success" : "destructive"}
          className="text-sm gap-1 px-2 py-1.5"
        >
          {props.percent >= 0 ? (
            <ArrowUpIcon className="size-4 " />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
          {percentValue}
        </Badge>
      </div>
    </ToolTipLabel>
  );
}

export function TableData({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-sm">{children}</td>;
}

export function TableHeadingRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="sticky top-0 bg-background z-10">
      {children}
      <div className="border-b border-border absolute inset-0 z-10" />
    </tr>
  );
}

export function TableHeading(props: { children: React.ReactNode }) {
  return (
    <th className="bg-secondary border-b border-border text-left px-3 py-3 text-sm font-medium text-muted-foreground min-w-[150px]">
      {props.children}
    </th>
  );
}

export function IntervalSelector(props: {
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
      <SelectTrigger className="bg-transparent w-auto">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="week"> Weekly </SelectItem>
        <SelectItem value="day"> Daily</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const chartHeight = 220;
