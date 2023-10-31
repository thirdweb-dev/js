import { Stack, UseDisclosureReturn } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Button, Card, Heading, Text } from "tw-components";
import { EngineHostingOptionsCta } from "./hosting-options-cta";

interface EngineNavigationProps {
  instance: string;
  disclosure: UseDisclosureReturn;
}

export const NoServerConnection: React.FC<EngineNavigationProps> = ({
  instance,
  disclosure,
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
    <>
      <Card p={10} bgColor="backgroundHighlight" borderColor="#0000" my={6}>
        <Stack spacing={4}>
          <Heading size="title.sm">Unable to connect</Heading>
          <Text>
            There was a problem connecting to your Engine instance. Please
            confirm the URL is correct and the server is running, or{" "}
            <Button
              variant="link"
              onClick={disclosure.onOpen}
              color="blue.500"
              size="sm"
            >
              provide a different Engine URL
            </Button>
            .
          </Text>
        </Stack>
      </Card>

      <EngineHostingOptionsCta />
    </>
  );
};
