import { PublishedContractTable } from "../contract-table-v2";
import { usePublishedContractsQuery } from "../hooks";
import { ShowMoreButton } from "./show-more-button";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useMemo, useState } from "react";
import { IoRefreshSharp } from "react-icons/io5";
import { Button, Heading, LinkButton, Text } from "tw-components";

interface PublishedContractsProps {
  address?: string;
  noHeader?: boolean;
  limit?: number;
}

export const PublishedContracts: React.FC<PublishedContractsProps> = ({
  address,
  noHeader,
  limit = 10,
}) => {
  const [showMoreLimit, setShowMoreLimit] = useState(limit);
  const trackEvent = useTrack();
  const publishedContractsQuery = usePublishedContractsQuery(address);

  const slicedData = useMemo(() => {
    if (publishedContractsQuery.data) {
      return publishedContractsQuery.data.slice(0, showMoreLimit);
    }
    return [];
  }, [publishedContractsQuery.data, showMoreLimit]);

  return (
    <>
      {!noHeader && (
        <Flex
          justify="space-between"
          align="top"
          gap={4}
          direction={{ base: "column", md: "row" }}
          pos="sticky"
          top={{ base: "56px", md: 0 }}
          py={{ base: 4, md: 8 }}
          zIndex="docked"
          backdropFilter="blur(4px)"
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            opacity: 0.8,
            bg: "linear-gradient(180deg, var(--chakra-colors-backgroundBody) 50%, transparent 100%)",
          }}
        >
          <Flex gap={2} direction="column">
            <Heading size="title.md">Published contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of contract instances that you have published with
              thirdweb
            </Text>
          </Flex>
          <LinkButton
            colorScheme="primary"
            href="https://portal.thirdweb.com/contracts/publish/overview"
            isExternal
            onClick={() => {
              trackEvent({
                category: "dashboard",
                action: "click",
                label: "learn-more-about-release",
              });
            }}
          >
            Learn more about Publish
          </LinkButton>
        </Flex>
      )}
      <PublishedContractTable
        isFetching={publishedContractsQuery.isFetching}
        contractDetails={slicedData}
        hidePublisher
      >
        {publishedContractsQuery.isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading published contracts</Text>
            </Flex>
          </Center>
        )}
        {publishedContractsQuery.isError && (
          <Center>
            <Flex mt={4} py={4} direction="column" gap={4} align="center">
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>
                  Failed to fetch published contracts
                </AlertTitle>
                <Button
                  onClick={() => publishedContractsQuery.refetch()}
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
        {publishedContractsQuery.isSuccess &&
          publishedContractsQuery.data.length === 0 && (
            <Center>
              <Flex py={4} direction="column" gap={4} align="center">
                <Text>No published contracts found.</Text>
              </Flex>
            </Center>
          )}
        {publishedContractsQuery.isSuccess &&
          publishedContractsQuery.data.length > slicedData.length && (
            <ShowMoreButton
              limit={limit}
              showMoreLimit={showMoreLimit}
              setShowMoreLimit={setShowMoreLimit}
            />
          )}
      </PublishedContractTable>
    </>
  );
};
