import { Container, Divider, Flex } from "@chakra-ui/react";
import { Card, Heading, Text } from "tw-components";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";

export const ConnectWalletPrompt = () => {
  return (
    <Container maxW="lg">
      <Card p={6} as={Flex} flexDir="column" gap={2}>
        <Heading as="h2" size="title.sm">
          Connect your wallet to get started
        </Heading>
        <Text>
          In order to manage your developer API keys and Billing Account, you
          need to sign-in with a wallet.
        </Text>
        <Divider my={4} />
        <CustomConnectWallet />
      </Card>
    </Container>
  );
};
