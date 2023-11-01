import { Stack, UseDisclosureReturn } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect } from "react";
import { Button, Card, Heading, Text } from "tw-components";
import { EngineHostingOptionsCta } from "./hosting-options-cta";

interface EngineNavigationProps {
  instance: string;
  disclosure: UseDisclosureReturn;
}

export const NoAuthorizedWallet: React.FC<EngineNavigationProps> = ({
  instance,
  disclosure,
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
    <>
      <Card p={10} bgColor="backgroundHighlight" borderColor="#0000" my={6}>
        <Stack spacing={4}>
          <Heading size="title.sm">Unauthorized</Heading>
          <Text>You do not have permission to view this Engine instance.</Text>
          <Text>
            Please sign in with an admin wallet, contact the owner to add your
            wallet address as an admin, or{" "}
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
