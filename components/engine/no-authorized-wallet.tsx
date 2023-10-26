import { Flex } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

export const NoAuthorizedWallet = () => {
  return (
    <Card py={8}>
      <Flex flexDir="column" gap={4}>
        <Text textAlign="center">
          You do not have permission to view this Engine instance. Please
          connect from a wallet with permission or ask the admin of the instance
          to grant you permission.
        </Text>
      </Flex>
    </Card>
  );
};
