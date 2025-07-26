"use client";

import { CircleAlertIcon } from "lucide-react";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  type EngineInstance,
  useEngineQueueMetrics,
  useEngineSystemMetrics,
} from "@/hooks/useEngine";
import { ErrorRate } from "./ErrorRate";
import { Healthcheck } from "./Healthcheck";
import { StatusCodes } from "./StatusCodes";

export function EngineSystemMetrics({
  instance,
  teamSlug,
  projectSlug,
  authToken,
}: {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}) {
  const systemMetricsQuery = useEngineSystemMetrics(
    instance.id,
    teamSlug,
    projectSlug,
  );
  const queueMetricsQuery = useEngineQueueMetrics({
    authToken,
    instanceUrl: instance.url,
    pollInterval: 10_000,
  });

  let systemMetricsPanel = <GenericLoadingPage />;
  if (!systemMetricsQuery.data || systemMetricsQuery.isError) {
    systemMetricsPanel = (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          System Metrics
        </h2>

        <Alert variant="warning">
          <CircleAlertIcon className="size-5" />
          <AlertTitle>
            System metrics are not available for self-hosted Engine
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm">
            Upgrade to a{" "}
            <UnderlineLink
              href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/create`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Engine instance managed by thirdweb
            </UnderlineLink>{" "}
            to view system metrics
          </AlertDescription>
        </Alert>
      </div>
    );
  } else {
    systemMetricsPanel = (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            System Metrics
          </h2>
          <Healthcheck instance={instance} />
        </div>

        <div className="space-y-8">
          <StatusCodes
            datapoints={systemMetricsQuery.data.result.statusCodes}
          />
          <ErrorRate datapoints={systemMetricsQuery.data.result.errorRate} />
        </div>
      </div>
    );
  }

  let queueMetricsPanel = <GenericLoadingPage />;

  if (
    !queueMetricsQuery.isPending &&
    (!queueMetricsQuery.data || queueMetricsQuery.isError)
  ) {
    queueMetricsPanel = (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border">
        No Data Available
      </div>
    );
  } else if (queueMetricsQuery.data) {
    const numQueued = queueMetricsQuery.data.result.queued;
    const numPending = queueMetricsQuery.data.result.pending;
    const msToSend = queueMetricsQuery.data.result.latency?.msToSend;
    const msToMine = queueMetricsQuery.data.result.latency?.msToMine;

    queueMetricsPanel = (
      <div className="bg-card p-4 rounded-lg border lg:p-6">
        <h2 className="text-lg tracking-tight font-semibold mb-3">
          Queue Metrics
        </h2>

        <div className="space-y-2">
          <MetricRow label="Queued" value={numQueued} />
          <MetricRow label="Pending" value={numPending} />

          {msToSend && (
            <MetricRow
              label="Time to send"
              value={
                <span>
                  p50 {(msToSend.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToSend.p90 / 1000).toFixed(2)}s
                </span>
              }
            />
          )}
          {msToMine && (
            <MetricRow
              label="Time to mine"
              value={
                <span>
                  p50 {(msToMine.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToMine.p90 / 1000).toFixed(2)}s
                </span>
              }
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {systemMetricsPanel}
      {queueMetricsPanel}
    </div>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 w-[400px]">
      <h3 className="text-sm font-medium">{label}</h3>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
