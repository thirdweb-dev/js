import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractReleaseForm } from "components/contract-components/contract-release-form";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const ContractsPublishPage: ThirdwebNextPage = () => {
  const contractId = useSingleQueryParam("contractId");

  return (
    <>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Create a Release</Heading>
          <Text fontStyle="normal" maxW="container.lg">
            Releases are recorded on chain, and enable others to deploy this
            contract and track new versions.
            <br /> Unlocks automatic SDKs in all languages, admin dashboards,
            analytics and auto verification.{" "}
            <Link
              color="blue.500"
              isExternal
              href="https://portal.thirdweb.com/release"
            >
              Learn more
            </Link>
          </Text>
        </Flex>
        {contractId && <ContractReleaseForm contractId={contractId} />}
      </Flex>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ContractsPublishPage.getLayout = (page, props) => (
  <AppLayout {...props}>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);

ContractsPublishPage.pageId = PageId.ReleaseSingle;

export default ContractsPublishPage;
