import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";

const stackedRequestChartConfig = {
  "200": {
    color: "hsl(142, 76%, 36%)", // Green for success
    label: "Success (2xx)",
  },
  "400": {
    color: "hsl(45, 93%, 47%)", // Yellow for client errors
    label: "Client Error (4xx)",
  },
  "500": {
    color: "hsl(0, 84%, 60%)", // Red for server errors
    label: "Server Error (5xx)",
  },
} satisfies ChartConfig;

interface StatusCodesChartProps {
  data: any[];
  isPending: boolean;
}

export function StatusCodesChart({ data, isPending }: StatusCodesChartProps) {
  return (
    <ThirdwebBarChart
      chartClassName="h-[500px] w-full"
      config={stackedRequestChartConfig}
      data={data}
      header={{
        description: "HTTP status codes metrics for the selected webhook",
        title: "Status Codes",
      }}
      hideLabel={false}
      showLegend={true}
      variant="stacked"
      isPending={isPending}
    />
  );
}