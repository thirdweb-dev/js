import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Container,
  Flex,
  IconButton,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { IoRefreshSharp } from "react-icons/io5";
import {
  Button,
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
} from "tw-components";

function DeployCustomContract() {
  const router = useRouter();

  const walletAddress = useAddress();
  const publishedContracts = usePublishedContractsQuery();

  return (
    <Card px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <IconButton
            onClick={() => router.back()}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />
          <VStack>
            <Heading size="title.lg">Published Contracts</Heading>
            <Text>Deploy custom contracts written by you or your team</Text>
          </VStack>
          <Box />
        </Flex>
        <Container maxW="container.md" as={Flex} gap={12} direction="column">
          <DeployableContractTable
            isFetching={publishedContracts.isFetching}
            contractIds={(publishedContracts.data || [])?.map((d) =>
              d.metadataUri.replace("ipfs://", ""),
            )}
          >
            {publishedContracts.isLoading && (
              <Center>
                <Flex py={4} direction="row" gap={4} align="center">
                  {walletAddress && <Spinner size="sm" />}
                  <Text>
                    {walletAddress
                      ? "Loading your contracts"
                      : "No wallet connected"}
                  </Text>
                </Flex>
              </Center>
            )}
            {publishedContracts.isError && (
              <Center>
                <Flex mt={4} py={4} direction="column" gap={4} align="center">
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      Failed to fetch published contracts
                    </AlertTitle>
                    <Button
                      onClick={() => publishedContracts.refetch()}
                      leftIcon={<IoRefreshSharp />}
                      ml="auto"
                      size="sm"
                      colorScheme="red"
                    >
                      Retry
                    </Button>
                  </Alert>
                </Flex>
              </Center>
            )}
            {publishedContracts.isSuccess &&
              publishedContracts.data.length === 0 && (
                <Center>
                  <Flex py={4} direction="column" gap={4} align="center">
                    <Text>You have not published any contracts yet.</Text>
                    <LinkButton
                      size="sm"
                      href="https://portal.thirdweb.com/thirdweb-deploy"
                      isExternal
                      variant="outline"
                      colorScheme="primary"
                    >
                      Learn more
                    </LinkButton>
                  </Flex>
                </Center>
              )}
          </DeployableContractTable>

          <Flex flexDir="column" gap={4}>
            <Heading size="title.md">Add new published contracts</Heading>
            <Card as={Flex} flexDir="column" gap={3}>
              <Text>
                Run this command in your project to make your contracts easily
                deployable:
              </Text>
              <CodeBlock code="npx thirdweb publish" language={"javascript"} />
            </Card>
            {/*             <Card as={Flex} flexDir="column" gap={2}>
              <Text>Automatically publish contracts with Github Actions</Text>
              <CodeBlock
                code="npx thirdweb install-ci"
                language={"javascript"}
              />
            </Card> */}
          </Flex>
        </Container>
      </Flex>
    </Card>
  );
}

export default function DeployCustomContractWrapped() {
  return (
    <PublisherSDKContext>
      <DeployCustomContract />
    </PublisherSDKContext>
  );
}

DeployCustomContractWrapped.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
