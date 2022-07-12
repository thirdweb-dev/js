import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Container,
  Flex,
  IconButton,
  Link,
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
import { pushToPreviousRoute } from "utils/pushToPreviousRoute";

function DeployCustomContract() {
  const router = useRouter();

  const walletAddress = useAddress();
  const publishedContracts = usePublishedContractsQuery(walletAddress);

  return (
    <Card px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Flex direction="column" gap={12}>
        <Flex align="center" justify="space-between">
          <IconButton
            onClick={() => pushToPreviousRoute(router)}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />
          <VStack>
            <Heading size="title.lg">Released Contracts</Heading>
            <Text>Deploy contracts released by you or your team</Text>
          </VStack>
          <Box />
        </Flex>
        <Container maxW="container.page" as={Flex} gap={12} direction="column">
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
                      Failed to fetch released contracts
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
                    <Text>You have not released any contracts yet.</Text>
                    <LinkButton
                      size="sm"
                      href="https://portal.thirdweb.com/thirdweb-deploy/thirdweb-cli"
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
            <Heading size="title.md">How to create releases</Heading>
            <Card as={Flex} flexDir="column" gap={3}>
              <Text>
                Run this command in your project to create deployable releases
                of your own contracts
              </Text>
              <CodeBlock code="npx thirdweb release" language={"javascript"} />
              <Link
                fontSize={14}
                color="primary.500"
                isExternal
                href="https://portal.thirdweb.com/thirdweb-deploy/thirdweb-cli"
              >
                Learn more about releasing contracts
              </Link>
            </Card>
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
