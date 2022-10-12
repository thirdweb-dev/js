import { ReleasedContractTable } from "../contract-table-v2";
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

interface ReleasedContractsProps {
  address?: string;
  noHeader?: boolean;
  limit?: number;
}

export const ReleasedContracts: React.FC<ReleasedContractsProps> = ({
  address,
  noHeader,
  limit = 10,
}) => {
  const [showMoreLimit, setShowMoreLimit] = useState(limit);
  const trackEvent = useTrack();
  const releasedContractsQuery = usePublishedContractsQuery(address);

  const slicedData = useMemo(() => {
    if (releasedContractsQuery.data) {
      return releasedContractsQuery.data.slice(0, showMoreLimit);
    }
    return [];
  }, [releasedContractsQuery.data, showMoreLimit]);

  return (
    <>
      {!noHeader && (
        <Flex
          justify="space-between"
          align="top"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap={2} direction="column">
            <Heading size="title.md">Released contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of contract instances that you have released with
              thirdweb
            </Text>
          </Flex>
          <LinkButton
            colorScheme="primary"
            href="https://portal.thirdweb.com/release"
            isExternal
            onClick={() => {
              trackEvent({
                category: "dashboard",
                action: "click",
                label: "learn-more-about-release",
              });
            }}
          >
            Learn more about Release
          </LinkButton>
        </Flex>
      )}
      <ReleasedContractTable
        isFetching={releasedContractsQuery.isFetching}
        contractDetails={slicedData}
        hideReleasedBy
      >
        {releasedContractsQuery.isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading releases</Text>
            </Flex>
          </Center>
        )}
        {releasedContractsQuery.isError && (
          <Center>
            <Flex mt={4} py={4} direction="column" gap={4} align="center">
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>
                  Failed to fetch released contracts
                </AlertTitle>
                <Button
                  onClick={() => releasedContractsQuery.refetch()}
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
        {releasedContractsQuery.isSuccess &&
          releasedContractsQuery.data.length === 0 && (
            <Center>
              <Flex py={4} direction="column" gap={4} align="center">
                <Text>No releases found.</Text>
              </Flex>
            </Center>
          )}
        {releasedContractsQuery.isSuccess &&
          releasedContractsQuery.data.length > slicedData.length && (
            <ShowMoreButton
              limit={limit}
              showMoreLimit={showMoreLimit}
              setShowMoreLimit={setShowMoreLimit}
            />
          )}
      </ReleasedContractTable>
    </>
  );
};
