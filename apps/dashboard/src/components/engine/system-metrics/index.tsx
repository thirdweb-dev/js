import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type EngineInstance,
  useEngineResourceMetrics,
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
  const query = useEngineResourceMetrics(instance.id);

  if (query.isLoading) {
    return <Spinner className="h-4 w-4" />;
  }

  if (!query.data || query.isError) {
    return (
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
              href="/dashboard/engine?requestCloudHosted"
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
  }

  return (
    <>
      <Card p={16}>
        <Stack spacing={4}>
          <Flex gap={2} align="center" pb={-2}>
            <Icon as={FaChartArea} />
            <Heading size="title.md">Metrics</Heading>
          </Flex>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-4">
            <Healthcheck instance={instance} />
          </div>
          <StatusCodes datapoints={query.data.data.statusCodes} />
          <ErrorRate datapoints={query.data.data.errorRate} />
        </Stack>
      </Card>
    </>
  );
};
