import { Box, Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { BuiltinContractMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement, useMemo } from "react";
import {
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";

const Contracts: ThirdwebNextPage = () => {
  const walletAddress = useAddress();
  const releasedContractsQuery = usePublishedContractsQuery(walletAddress);

  const prebuiltContracts = Object.keys(BuiltinContractMap).filter(
    (contract) => contract !== "custom",
  );

  const releasedContracts = useMemo(
    () =>
      (releasedContractsQuery.data || [])?.map((d) =>
        d.metadataUri.replace("ipfs://", ""),
      ),
    [releasedContractsQuery],
  );

  const allContracts = useMemo(
    () => [...releasedContracts, ...prebuiltContracts],
    [prebuiltContracts, releasedContracts],
  );

  return (
    <>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Contracts</Heading>
          <Text fontStyle="italic">
            A combination of our{" "}
            <TrackedLink
              category="contracts"
              label="pre-built"
              href="https://portal.thirdweb.com/pre-built-contracts"
              isExternal
              color="blue.500"
            >
              pre-built contracts
            </TrackedLink>{" "}
            and your{" "}
            <TrackedLink
              category="contracts"
              label="released"
              href="https://portal.thirdweb.com/release"
              isExternal
              color="blue.500"
            >
              released contracts
            </TrackedLink>
            . Not sure which contract is right for your use-case?{" "}
            <TrackedLink
              category="contracts"
              label="take-quiz"
              href="https://portal.thirdweb.com/pre-built-contracts/choosing-the-right-pre-built-contract"
              isExternal
              color="blue.500"
            >
              Help me choose.
            </TrackedLink>
          </Text>
        </Flex>
        <DeployableContractTable
          isFetching={releasedContractsQuery.isFetching}
          contractIds={allContracts}
          context="view_release"
        />

        <Card
          bg="backgroundHighlight"
          p={8}
          outlineBorder={{
            gradient: "linear(147.15deg, #410AB6 30.17%, #E85CFF 100%)",
            width: "5px",
          }}
        >
          <Flex
            gap={4}
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            <Flex gap={6} direction="column">
              <Heading size="title.md">
                Don&apos;t see the contract you want? Release your own!
              </Heading>

              <Box>
                <CodeBlock code="npx thirdweb release" language="bash" />
              </Box>
            </Flex>
            <LinkButton
              colorScheme="purple"
              w={{ base: "full", md: "auto" }}
              isExternal
              href="https://portal.thirdweb.com/release"
              size="md"
            >
              Learn more
            </LinkButton>
          </Flex>
        </Card>
      </Flex>
    </>
  );
};

Contracts.getLayout = (page: ReactElement) => (
  <AppLayout>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);

Contracts.pageId = PageId.Contracts;

export default Contracts;
