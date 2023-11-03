import { Flex, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { Card, LinkButton, Text } from "tw-components";

export const NoApiKeys = () => {
  return (
    <Card pt={4} pb={8}>
      <VStack alignItems="center" justifyContent="center" gap={6}>
        <Image
          src="/assets/tw-icons/keys.png"
          width={77}
          height={95}
          alt="no keys"
        />
        <Flex flexDir="column" gap={4} alignItems="center">
          <Text>
            You&apos;ll need to create an API Key to use embedded wallets.
          </Text>
          <LinkButton href="/dashboard/settings/api-keys" colorScheme="blue">
            Create API Key
          </LinkButton>
        </Flex>
      </VStack>
    </Card>
  );
};
