import { ResponsiveSuspense } from "responsive-rsc";
import { getWebhookLatency } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { WebhookLatencyChartUI } from "./WebhookLatencyChartUI";

interface WebhookLatencyChartProps {
  teamId: string;
  projectId: string;
  range: Range;
  interval: "day" | "week";
  webhookId?: string;
}

async function WebhookLatencyChartServer({
  teamId,
  projectId,
  range,
  interval,
  webhookId,
}: WebhookLatencyChartProps) {
  const latencyResponse = await getWebhookLatency({
    from: range.from,
    period: interval,
    projectId,
    teamId,
    to: range.to,
  });

  if ("error" in latencyResponse) {
    console.error("Failed to fetch webhook latency:", latencyResponse.error);
    return <WebhookLatencyChartUI data={[]} isPending={false} />;
  }

  let latencyData = latencyResponse.data;

  // Filter by webhook if specified
  if (webhookId) {
    latencyData = latencyData.filter((item) => item.webhookId === webhookId);
  }

  // Filter by date range
  const filteredLatencyData = latencyData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= range.from && itemDate <= range.to;
  });

  return <WebhookLatencyChartUI data={filteredLatencyData} isPending={false} />;
}

export function WebhookLatencyChart(props: WebhookLatencyChartProps) {
  return (
    <ResponsiveSuspense
      fallback={<WebhookLatencyChartUI data={[]} isPending={true} />}
      searchParamsUsed={["from", "to", "interval", "webhook"]}
    >
      <WebhookLatencyChartServer {...props} />
    </ResponsiveSuspense>
  );
}
