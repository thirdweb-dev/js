import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Card, Text } from "tw-components";

interface EngineNavigationProps {
  instance: string;
}

export const NoConnectedWallet: React.FC<EngineNavigationProps> = ({
  instance,
}) => {
  const trackEvent = useTrack();

  useEffect(() => {
    if (instance) {
      trackEvent({
        category: "engine",
        action: "set-engine-instance",
        label: "no-connected-wallet",
        url: instance,
      });
    }
  }, [instance, trackEvent]);

  return (
    <Card py={8}>
      <Flex flexDir="column" gap={4}>
        <Text textAlign="center">
          Sign in with an admin wallet for your Engine instance.
        </Text>
        <Flex justifyContent="center">
          <CustomConnectWallet />
        </Flex>
      </Flex>
    </Card>
  );
};
