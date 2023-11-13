import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Stack } from "@chakra-ui/react";
import { Card, Heading, Text, TrackedLink } from "tw-components";

export const EngineNoConnectedWallet: React.FC = () => {
  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="title.lg" as="h1">
          Engine
        </Heading>
        <Text>
          Engine is a backend HTTP server that calls smart contracts with your
          backend wallets.{" "}
          <TrackedLink
            href="https://portal.thirdweb.com/engine"
            isExternal
            category="engine"
            label="clicked-learn-more"
            color="blue.500"
          >
            Learn more about Engine
          </TrackedLink>
          .
        </Text>
      </Stack>

      <Card p={8}>
        <Stack>
          <Heading size="label.lg">Get Started</Heading>
          <Text>
            Sign in with your Engine admin wallet to manage it from this
            dashboard.
          </Text>

          <CustomConnectWallet />
        </Stack>
      </Card>

      <Text>
        Don&apos;t have Engine set up yet?{" "}
        <TrackedLink
          href="https://share.hsforms.com/1k5tu00ueS5OYMaxHK6De-gea58c"
          isExternal
          category="engine"
          label="cloud-hosted"
          color="blue.500"
        >
          Get a cloud-hosted Engine
        </TrackedLink>{" "}
        or{" "}
        <TrackedLink
          href="https://portal.thirdweb.com/engine/getting-started"
          isExternal
          category="engine"
          label="self-hosted"
          color="blue.500"
        >
          learn how to self-host
        </TrackedLink>
        .
      </Text>
    </Stack>
  );
};
