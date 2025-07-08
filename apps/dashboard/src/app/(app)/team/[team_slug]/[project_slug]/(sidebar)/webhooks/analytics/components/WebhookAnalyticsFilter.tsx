"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFiltersFromSearchParams, normalizeTimeISOString } from "@/lib/time";

type SearchParams = {
  from?: string;
  to?: string;
  interval?: "day" | "week";
};

interface WebhookAnalyticsFilterProps {
  webhookConfigs: Array<{
    id: string;
    description: string | null;
  }>;
  selectedWebhookId: string;
}

export function WebhookPicker({
  webhookConfigs,
  selectedWebhookId,
}: WebhookAnalyticsFilterProps) {
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  return (
    <Select
      onValueChange={(value) => {
        setResponsiveSearchParams((prev) => ({
          ...prev,
          webhook: value,
        }));
      }}
      value={selectedWebhookId}
    >
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Webhooks</SelectItem>
        {webhookConfigs.map((config) => (
          <SelectItem key={config.id} value={config.id}>
            <span>{config.description || "Unnamed webhook"}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DateRangeControls() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: responsiveSearchParams.from,
    interval: responsiveSearchParams.interval,
    to: responsiveSearchParams.to,
  });

  return (
    <div className="flex items-center gap-3">
      <DateRangeSelector
        popoverAlign="end"
        range={range}
        setRange={(newRange) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              from: normalizeTimeISOString(newRange.from),
              to: normalizeTimeISOString(newRange.to),
            };
            return newParams;
          });
        }}
      />

      <IntervalSelector
        intervalType={interval}
        setIntervalType={(newInterval) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              interval: newInterval,
            };
            return newParams;
          });
        }}
      />
    </div>
  );
}
