import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Flex, Stack } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Card, Text } from "tw-components";
import { EngineHostingOptionsCta } from "./hosting-options-cta";

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
    <>
      <Card p={10} bgColor="backgroundHighlight" borderColor="#0000" my={6}>
        <Stack textAlign="center" spacing={4}>
          <Text>Sign in with an admin wallet from your Engine instance.</Text>
          <Flex justifyContent="center">
            <CustomConnectWallet />
          </Flex>
        </Stack>
      </Card>

      <EngineHostingOptionsCta />
    </>
  );
};
