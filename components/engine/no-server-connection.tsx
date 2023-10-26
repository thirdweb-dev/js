import { Flex } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

export const NoServerConnection = () => {
  return (
    <Card py={8}>
      <Flex flexDir="column" gap={4}>
        <Text textAlign="center">
          We weren&apos;t able to establish a connection with Engine. Please
          ensure the URL is correct, and the server is running.
        </Text>
      </Flex>
    </Card>
  );
};
