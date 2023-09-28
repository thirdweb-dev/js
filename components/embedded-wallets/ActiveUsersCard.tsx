import { VStack, useColorModeValue } from "@chakra-ui/react";

import { Card, Heading, Text } from "tw-components";

interface ActiveUsersCardProps {
  count: number;
}

export const ActiveUsersCard: React.FC<ActiveUsersCardProps> = ({ count }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  return (
    <Card px={6} py={8} bg={bg} maxW={{ base: "auto", md: "200" }}>
      <VStack alignItems="flex-start">
        <Text size="body.lg">Active Wallet Users</Text>
        <Heading as="h3" size="label.xl" isTruncated>
          {count}
        </Heading>
      </VStack>
    </Card>
  );
};
