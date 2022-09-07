import { Center, Container, Flex, Stack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { FiPlus } from "react-icons/fi";
import { Card, Heading, LinkButton, Text } from "tw-components";

export const NoContracts: React.FC = () => {
  return (
    <Center w="100%">
      <Container as={Card}>
        <Stack py={7} align="center" spacing={6} w="100%">
          <ChakraNextImage
            src={require("public/assets/illustrations/listing.png")}
            alt="no apps"
            boxSize={20}
            maxW="200px"
            mb={3}
          />
          <Flex direction="column" gap={2} align="center">
            <Heading size="title.md" textAlign="center">
              You don&apos;t have any contracts
            </Heading>
            <Text size="body.lg" textAlign="center">
              We found projects on thirdweb v1, but you don&apos;t have any
              contracts on thirdweb v2, deploy a contract go get started or
              navigate to V1 contracts.
            </Text>
          </Flex>
          <LinkButton
            leftIcon={<FiPlus />}
            colorScheme="primary"
            href="/contracts"
          >
            Deploy new contract
          </LinkButton>
        </Stack>
      </Container>
    </Center>
  );
};
