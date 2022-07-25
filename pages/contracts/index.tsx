import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { BuiltinContractMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import { ReactElement } from "react";
import { IoRefreshSharp } from "react-icons/io5";
import { Badge, Button, Heading, LinkButton, Text } from "tw-components";

const ContractsHomepageWrapped: React.FC = () => {
  const { Track } = useTrack({
    page: "contracts",
  });

  const walletAddress = useAddress();
  const publishedContracts = usePublishedContractsQuery(walletAddress);

  return (
    <Track>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Pre-built contracts</Heading>
          <Text fontStyle="italic">
            Contracts created by the thirdweb team that you can deploy
          </Text>
        </Flex>
        <DeployableContractTable
          context="built-in"
          contractIds={Object.keys(BuiltinContractMap).filter(
            (contract) => contract !== "custom",
          )}
        />
        <Box />
        <Flex gap={2} direction="column">
          <Heading size="title.md">
            Your published contracts{" "}
            <Badge variant="outline" colorScheme="purple">
              beta
            </Badge>
          </Heading>
          <Text fontStyle="italic">
            Contracts that you have published via the thirdweb cli
          </Text>
        </Flex>
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
                    href="https://portal.thirdweb.com/thirdweb-cli"
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
      </Flex>
    </Track>
  );
};

export default function ContractsHomepage() {
  return (
    <PublisherSDKContext>
      <ContractsHomepageWrapped />
    </PublisherSDKContext>
  );
}

ContractsHomepage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
