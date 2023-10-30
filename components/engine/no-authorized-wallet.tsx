import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Card, Text } from "tw-components";

interface EngineNavigationProps {
  instance: string;
}

export const NoAuthorizedWallet: React.FC<EngineNavigationProps> = ({
  instance,
}) => {
  const trackEvent = useTrack();

  useEffect(() => {
    if (instance) {
      trackEvent({
        category: "engine",
        action: "set-engine-instance",
        label: "no-authorized-wallet",
        url: instance,
      });
    }
  }, [instance, trackEvent]);

  return (
    <Card py={8}>
      <Flex flexDir="column" gap={4}>
        <Text textAlign="center">
          You do not have permission to view this Engine instance. Please sign
          in with an admin wallet.
        </Text>
      </Flex>
    </Card>
  );
};
