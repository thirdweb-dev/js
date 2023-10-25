import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Flex } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

export const NoConnectedWallet = () => {
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
