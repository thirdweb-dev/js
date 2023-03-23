import { usePublishedContractsQuery } from "../../../components/contract-components/hooks";
import { GetStarted } from "../../../components/dashboard/GetStarted";
import { ContractsSidebar } from "../../../core-ui/sidebar/contracts";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { PublishedContracts } from "components/contract-components/tables/published-contracts";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { PageId } from "page-id";
import { useMemo } from "react";
import { TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "published_contracts";

const Published: ThirdwebNextPage = () => {
  const address = useAddress();
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
        children: <ConnectWallet ecosystem="evm" />,
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
            href="https://portal.thirdweb.com/publish"
          >
            Learn how to publish contracts --&gt;
          </TrackedLink>
        ),
        completed: hasContracts,
      },
    ],
    [address, hasContracts],
  );

  return (
    <Box pt={8}>
      <ClientOnly fadeInDuration={600} ssr={null}>
        <ContractsSidebar activePage="published" />
        {address && publishedContractsQuery.isLoading ? (
          <Flex w="full" h="full" alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Flex flexDir="column" gap={12}>
            <GetStarted
              title="Get started with publishing contracts"
              description="Use this guide to start publishing contracts and be discovered by our community of web3 devs."
              steps={steps}
            />
            {address && hasContracts && (
              <PublishedContractsPage address={address} />
            )}
          </Flex>
        )}
      </ClientOnly>
    </Box>
  );
};

Published.getLayout = (page, props) => (
  <AppLayout ecosystem="evm" {...props}>
    {page}
  </AppLayout>
);
Published.pageId = PageId.Contracts;

export default Published;

interface ContractsProps {
  address: string;
}

const PublishedContractsPage: React.FC<ContractsProps> = ({ address }) => {
  return (
    <Flex direction="column" gap={8}>
      <PublisherSDKContext>
        <PublishedContracts address={address} />
      </PublisherSDKContext>
    </Flex>
  );
};
