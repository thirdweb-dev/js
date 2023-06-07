import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import ChainValidation from "components/chain-validation";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const ValidateChainPage: ThirdwebNextPage = () => {
  return (
    <>
      <NextSeo
        title="Validate Chain"
        description="Validate a given chain is compatible with thirdweb."
        noindex
        nofollow
      />
      <Flex direction="column" gap={8}>
        <Flex flexDir="column" gap={2}>
          <Heading as="h1">Validate Chain</Heading>
          <Text>
            Validate a given chain is compatible with{" "}
            <Link href="/chains" color="blue.500">
              thirdweb
            </Link>
            .
          </Text>
        </Flex>

        <ChainValidation />
      </Flex>
    </>
  );
};

ValidateChainPage.getLayout = function getLayout(page, props) {
  return <AppLayout {...props}>{page}</AppLayout>;
};

ValidateChainPage.pageId = PageId.GasEstimator;

export default ValidateChainPage;
