"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type EngineInstance,
  useEngineQueueMetrics,
  useEngineSystemMetrics,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Icon, Stack } from "@chakra-ui/react";
import { FaChartArea } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ErrorRate } from "./components/ErrorRate";
import { Healthcheck } from "./components/Healthcheck";
import { StatusCodes } from "./components/StatusCodes";

interface EngineStatusProps {
  instance: EngineInstance;
}

export const EngineSystemMetrics: React.FC<EngineStatusProps> = ({
  instance,
}) => {
  const systemMetricsQuery = useEngineSystemMetrics(instance.id);
  const queueMetricsQuery = useEngineQueueMetrics(instance.url, 10_000);

  let systemMetricsPanel = <Spinner className="h-4 w-4" />;
  if (!systemMetricsQuery.data || systemMetricsQuery.isError) {
    systemMetricsPanel = (
      <Card p={8}>
        <Stack spacing={4}>
          <Flex gap={2} align="center">
            <Icon as={IoIosInformationCircleOutline} />
            <Heading size="title.xs">
              System metrics are unavailable for self-hosted Engine.
            </Heading>
          </Flex>
          <Text>
            Upgrade to a{" "}
            <TrackedLink
              href="/dashboard/engine/create"
              isExternal
              color="blue.500"
              category="engine"
              label="metrics-cloud-hosted-upsell"
            >
              Cloud-Hosted Engine managed by thirdweb
            </TrackedLink>{" "}
            to view these metrics.
          </Text>
        </Stack>
      </Card>
    );
  } else {
    systemMetricsPanel = (
      <Card p={16}>
        <Stack spacing={4}>
          <Flex gap={2} align="center" pb={-2}>
            <Icon as={FaChartArea} />
            <Heading size="title.md">System Metrics</Heading>
          </Flex>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Healthcheck instance={instance} />
          </div>
          <StatusCodes datapoints={systemMetricsQuery.data.data.statusCodes} />
          <ErrorRate datapoints={systemMetricsQuery.data.data.errorRate} />
        </Stack>
      </Card>
    );
  }

  let queueMetricsPanel = (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border">
      <Spinner className="size-6" />
    </div>
  );

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
      <Card p={8}>
        <Stack spacing={6}>
          <Flex gap={2} align="center">
            <Heading size="title.md">Queue Metrics</Heading>
          </Flex>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="flex-col gap-y-4">
              <h2 className="font-semibold"> Queued</h2>
              <p className="text-muted-foreground">{numQueued}</p>
            </div>
            <div className="flex-col gap-y-4">
              <h2 className="font-semibold">Pending</h2>
              <p className="text-muted-foreground">{numPending}</p>
            </div>

            {msToSend && (
              <div className="flex-col gap-y-4">
                <h2 className="font-semibold">Time to send</h2>
                <p className="text-muted-foreground">
                  p50 {(msToSend.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToSend.p90 / 1000).toFixed(2)}s
                </p>
              </div>
            )}
            {msToMine && (
              <div className="flex-col gap-y-4">
                <h2 className="font-semibold">Time to mine</h2>
                <p className="text-muted-foreground">
                  p50 {(msToMine.p50 / 1000).toFixed(2)}s, p90{" "}
                  {(msToMine.p90 / 1000).toFixed(2)}s
                </p>
              </div>
            )}
          </div>
        </Stack>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {systemMetricsPanel}
      {queueMetricsPanel}
    </div>
  );
};
