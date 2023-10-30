import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Card, Text } from "tw-components";

interface EngineNavigationProps {
  instance: string;
}

export const NoServerConnection: React.FC<EngineNavigationProps> = ({
  instance,
}) => {
  const trackEvent = useTrack();

  useEffect(() => {
    if (instance) {
      trackEvent({
        category: "engine",
        action: "set-engine-instance",
        label: "no-server-connection",
        url: instance,
      });
    }
  }, [instance, trackEvent]);

  return (
    <Card py={8}>
      <Flex flexDir="column" gap={4}>
        <Text textAlign="center">
          We weren&apos;t able to establish a connection with your Engine
          instance. Please confirm the URL is correct and the server is running.
        </Text>
      </Flex>
    </Card>
  );
};
