import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Center, Stack } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

export const NoWalletConnectedPayments = () => {
  return (
    <Card p={8} bgColor="backgroundCardHighlight" my={6}>
      <Center as={Stack} spacing={4}>
        <Text>Sign in with your wallet to continue.</Text>
        <CustomConnectWallet />
      </Center>
    </Card>
  );
};
