import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Stack } from "@chakra-ui/react";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { EngineOverviewDescription } from "./overview/engine-description";

export const EngineNoConnectedWallet: React.FC = () => {
  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="title.lg" as="h1">
          Engine
        </Heading>
        <Text>
          Engine is a backend HTTP server that calls smart contracts with your
          backend wallets. Reliably send blockchain transactions, manage smart
          wallets, enable gasless transactions, and more.{" "}
          <TrackedLink
            href="https://portal.thirdweb.com/engine"
            isExternal
            category="engine"
            label="clicked-learn-more"
            color="blue.500"
          >
            Learn more to get started for free
          </TrackedLink>
          .
        </Text>
      </Stack>

      <Card p={8}>
        <Stack>
          <Heading size="label.lg">Get Started</Heading>
          <Text>
            Sign in with your admin wallet to manage Engine instances from this
            dashboard.
          </Text>

          <EngineOverviewDescription />

          <CustomConnectWallet />
        </Stack>
      </Card>
    </Stack>
  );
};
