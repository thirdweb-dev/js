import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Center, Container, Flex, Stack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import WalletImg from "public/assets/illustrations/wallet.png";
import { Card, Heading, Text } from "tw-components";

export const NoWallet: React.FC = () => {
  return (
    <Center w="100%">
      <Container as={Card}>
        <Stack py={7} align="center" spacing={6} w="100%">
          <ChakraNextImage
            src={WalletImg}
            alt="no apps"
            boxSize={20}
            maxW="200px"
            mb={3}
          />
          <Flex direction="column" gap={2} align="center">
            <Heading size="title.md">Connect your wallet</Heading>
            <Text size="body.lg" textAlign="center">
              You need to connect your wallet to deploy and interact with your
              dashboard
            </Text>
          </Flex>
          <CustomConnectWallet />
        </Stack>
      </Container>
    </Center>
  );
};
