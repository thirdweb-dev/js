"use client";

import { useState } from "react";
import type { WebhookConfig } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebhookAnalyticsFilter } from "./WebhookAnalyticsFilter";
import { WebhookLatencyChart } from "./WebhookLatencyChart";
import { WebhookStatusChart } from "./WebhookStatusChart";

interface WebhookAnalyticsChartsProps {
  webhookConfigs: WebhookConfig[];
  range: Range;
  interval: "day" | "week";
  teamId: string;
  projectId: string;
}

export function WebhookAnalyticsCharts({
  webhookConfigs,
  range,
  interval,
  teamId,
  projectId,
}: WebhookAnalyticsChartsProps) {
  const [selectedWebhook, setSelectedWebhook] = useState<string>("all");

  // Filter webhook ID
  const webhookId = selectedWebhook === "all" ? undefined : selectedWebhook;

  const selectedWebhookConfig = webhookConfigs.find(
    (w) => w.id === selectedWebhook,
  );

  return (
    <div>
      <div className="mb-4 flex justify-start">
        <WebhookAnalyticsFilter />
      </div>

      <div className="space-y-6">
        {/* Header with webhook selector */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Webhook Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Performance metrics and trends for your webhooks
            </p>
          </div>

          <div className="flex gap-3">
            <Select onValueChange={setSelectedWebhook} value={selectedWebhook}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Webhooks</SelectItem>
                {webhookConfigs.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    <div className="flex items-center gap-2">
                      <span>{config.description || "Unnamed webhook"}</span>
                      {config.pausedAt && (
                        <Badge className="text-xs" variant="secondary">
                          Paused
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected webhook info */}
        {selectedWebhookConfig && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {selectedWebhookConfig.description || "Unnamed Webhook"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedWebhookConfig.destinationUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedWebhookConfig.pausedAt ? "secondary" : "default"
                    }
                  >
                    {selectedWebhookConfig.pausedAt ? "Paused" : "Active"}
                  </Badge>
                  {selectedWebhookConfig.topics.slice(0, 2).map((topic) => (
                    <Badge key={topic.id} variant="outline">
                      {topic.serviceName}
                    </Badge>
                  ))}
                  {selectedWebhookConfig.topics.length > 2 && (
                    <Badge variant="outline">
                      +{selectedWebhookConfig.topics.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts - each wrapped individually */}
        <div className="flex flex-col gap-6">
          <WebhookStatusChart
            interval={interval}
            projectId={projectId}
            range={range}
            teamId={teamId}
            webhookId={webhookId}
          />

          <WebhookLatencyChart
            interval={interval}
            projectId={projectId}
            range={range}
            teamId={teamId}
            webhookId={webhookId}
          />
        </div>
      </div>
    </div>
  );
}
