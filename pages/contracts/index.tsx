import { DarkMode, Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { BuiltinContractMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import { ReactElement, useMemo } from "react";
import { Card, Heading, LinkButton, Text, TrackedLink } from "tw-components";

export default function ContractsHomepage() {
  const { Track } = useTrack({
    page: "contracts",
  });

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
    <Track>
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
              href="https://portal.thirdweb.com/thirdweb-cli"
              isExternal
              color="blue.500"
            >
              released contracts
            </TrackedLink>
            .
          </Text>
        </Flex>
        <DeployableContractTable
          isFetching={releasedContractsQuery.isFetching}
          contractIds={allContracts}
          context="view_release"
        />
        <DarkMode>
          <Card
            p={8}
            bgGradient="linear(147.15deg, #410AB6 30.17%, #E85CFF 100%)"
            border="none"
          >
            <Flex
              gap={4}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
            >
              <Flex gap={4} direction="column">
                <Heading color="white" size="title.lg" fontFamily="mono">
                  release
                </Heading>
                <Heading color="white" size="subtitle.md">
                  Bring your own contracts, unlock the power of thirdweb.
                </Heading>
              </Flex>
              <LinkButton
                w={{ base: "full", md: "auto" }}
                variant="ghost"
                isExternal
                href="https://portal.thirdweb.com/release"
                size="md"
              >
                Learn more
              </LinkButton>
            </Flex>
          </Card>
        </DarkMode>
      </Flex>
    </Track>
  );
}

ContractsHomepage.getLayout = (page: ReactElement) => (
  <AppLayout>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);
