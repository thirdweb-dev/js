import { format } from "date-fns";
import { useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { WebhookRequestStats } from "@/types/analytics";

interface WebhookStatusChartUIProps {
  data: WebhookRequestStats[];
  isPending: boolean;
}

export function WebhookStatusChartUI({
  data,
  isPending,
}: WebhookStatusChartUIProps) {
  // Process status code distribution data by individual status codes
  const statusCodeData = useMemo(() => {
    if (!data.length) return [];

    const groupedData = data.reduce(
      (acc, item) => {
        const date = new Date(item.date).getTime();
        if (!acc[date]) {
          acc[date] = { time: date };
        }

        // Only include valid status codes (not 0) with actual request counts
        if (item.httpStatusCode > 0 && item.totalRequests > 0) {
          const statusKey = item.httpStatusCode.toString();
          acc[date][statusKey] =
            (acc[date][statusKey] || 0) + item.totalRequests;
        }
        return acc;
      },
      {} as Record<string, Record<string, number> & { time: number }>,
    );

    return Object.values(groupedData).sort(
      (a, b) => (a.time || 0) - (b.time || 0),
    );
  }, [data]);

  // Generate status code chart config dynamically with class-based colors
  const statusCodeConfig: ChartConfig = useMemo(() => {
    const statusCodes = new Set<string>();
    statusCodeData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "time" && !Number.isNaN(Number.parseInt(key))) {
          statusCodes.add(key);
        }
      });
    });

    const getColorForStatusCode = (statusCode: number): string => {
      if (statusCode >= 200 && statusCode < 300) {
        return "hsl(142, 76%, 36%)"; // Green for 2xx
      } else if (statusCode >= 300 && statusCode < 400) {
        return "hsl(48, 96%, 53%)"; // Yellow for 3xx
      } else if (statusCode >= 400 && statusCode < 500) {
        return "hsl(25, 95%, 53%)"; // Orange for 4xx
      } else {
        return "hsl(0, 84%, 60%)"; // Red for 5xx
      }
    };

    const config: ChartConfig = {};
    Array.from(statusCodes)
      .sort((a, b) => {
        const codeA = Number.parseInt(a);
        const codeB = Number.parseInt(b);
        return codeA - codeB;
      })
      .forEach((statusKey) => {
        const statusCode = Number.parseInt(statusKey);
        config[statusKey] = {
          color: getColorForStatusCode(statusCode),
          label: statusCode.toString(),
        };
      });

    return config;
  }, [statusCodeData]);

  return (
    <ThirdwebBarChart
      chartClassName="h-[220px] w-full aspect-auto"
      config={statusCodeConfig}
      data={statusCodeData}
      header={{
        description: "Breakdown of responses by status code",
        title: "Response Status Codes",
      }}
      isPending={isPending}
      showLegend
      toolTipLabelFormatter={(label) =>
        format(new Date(Number.parseInt(label as string)), "MMM dd, yyyy HH:mm")
      }
      toolTipValueFormatter={(value) => `${value} requests`}
      variant="stacked"
    />
  );
}
