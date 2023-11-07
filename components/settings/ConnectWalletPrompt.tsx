import { Container, Divider, Flex } from "@chakra-ui/react";
import { Card, Heading, Text } from "tw-components";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";

interface ConnectWalletPromptProps {
  title?: string;
  prefix?: string;
  description?: string;
}

export const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "Connect your wallet",
  prefix = "Sign-in with your wallet to",
  description = "",
}) => {
  return (
    <Container maxW="lg">
      <Card p={6} as={Flex} flexDir="column" gap={2}>
        <Heading as="h2" size="title.sm">
          {title}
        </Heading>
        <Text>
          {prefix} {description || "get started"}.
        </Text>
        <Divider my={4} />
        <CustomConnectWallet />
      </Card>
    </Container>
  );
};
