import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Flex, Spinner } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { PublishedContracts } from "components/contract-components/tables/published-contracts";
import { StepsCard } from "components/dashboard/StepsCard";
import { ContractsSidebarLayout } from "core-ui/sidebar/contracts";
import { PageId } from "page-id";
import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { TrackedLink } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "published_contracts";

const Published: ThirdwebNextPage = () => {
  const address = useActiveAccount()?.address;
  const publishedContractsQuery = usePublishedContractsQuery(address);

  const hasContracts = useMemo(
    () => (publishedContractsQuery?.data?.length || 0) > 0,
    [publishedContractsQuery],
  );

  const steps = useMemo(
    () => [
      {
        title: "Connect your wallet to get started",
        description:
          "In order to interact with your contracts you need to connect an EVM compatible wallet.",
        children: <CustomConnectWallet />,
        completed: !!address,
      },
      {
        title: "Publish a contract",
        children: (
          <TrackedLink
            category={TRACKING_CATEGORY}
            label="learn_to_publish"
            color="blue.500"
            isExternal
            href="https://portal.thirdweb.com/contracts/publish/overview"
          >
            Learn how to publish contracts --&gt;
          </TrackedLink>
        ),
        completed: hasContracts,
      },
    ],
    [address, hasContracts],
  );

  if (address && publishedContractsQuery.isLoading) {
    return (
      <Flex w="full" h="full" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={12}>
      {hasContracts ? (
        <Flex gap={8} direction="column">
          <PublishedContracts address={address} />
        </Flex>
      ) : (
        <StepsCard
          title="Get started with publishing contracts"
          description="Use this guide to start publishing contracts and be discovered by our community of web3 devs."
          steps={steps}
        />
      )}
    </Flex>
  );
};

Published.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <ContractsSidebarLayout> {page} </ContractsSidebarLayout>
  </AppLayout>
);
Published.pageId = PageId.Contracts;

export default Published;
