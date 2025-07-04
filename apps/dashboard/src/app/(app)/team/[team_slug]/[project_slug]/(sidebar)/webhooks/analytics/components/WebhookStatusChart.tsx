import { ResponsiveSuspense } from "responsive-rsc";
import { getWebhookRequests } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { WebhookStatusChartUI } from "./WebhookStatusChartUI";

interface WebhookStatusChartProps {
  teamId: string;
  projectId: string;
  range: Range;
  interval: "day" | "week";
  webhookId?: string;
}

async function WebhookStatusChartServer({
  teamId,
  projectId,
  range,
  interval,
  webhookId,
}: WebhookStatusChartProps) {
  const requestsResponse = await getWebhookRequests({
    from: range.from,
    period: interval,
    projectId,
    teamId,
    to: range.to,
  });

  if ("error" in requestsResponse) {
    console.error("Failed to fetch webhook requests:", requestsResponse.error);
    return <WebhookStatusChartUI data={[]} isPending={false} />;
  }

  let requestsData = requestsResponse.data;

  // Filter by webhook if specified
  if (webhookId) {
    requestsData = requestsData.filter((item) => item.webhookId === webhookId);
  }

  // Filter by date range
  const filteredRequestsData = requestsData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= range.from && itemDate <= range.to;
  });

  return <WebhookStatusChartUI data={filteredRequestsData} isPending={false} />;
}

export function WebhookStatusChart(props: WebhookStatusChartProps) {
  return (
    <ResponsiveSuspense
      fallback={<WebhookStatusChartUI data={[]} isPending={true} />}
      searchParamsUsed={["from", "to", "interval", "webhook"]}
    >
      <WebhookStatusChartServer {...props} />
    </ResponsiveSuspense>
  );
}
