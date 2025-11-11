"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Metric = "payments" | "volume";

export function MetricSwitcher(props: {
  value: Metric;
  onChange: (value: Metric) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm font-medium">Show:</span>
      <Select value={props.value} onValueChange={props.onChange}>
        <SelectTrigger className="w-[180px] rounded-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="payments">Payments</SelectItem>
          <SelectItem value="volume">Volume (USD)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
