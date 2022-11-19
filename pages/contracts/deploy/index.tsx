import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement, useMemo } from "react";
import { Heading, Text } from "tw-components";

const ContractsDeployPage: ThirdwebNextPage = () => {
  const router = useRouter();

  const ipfsHashes = useMemo(() => {
    const ipfs = router.query.ipfs;
    return Array.isArray(ipfs) ? ipfs : [ipfs || ""];
  }, [router.query]);

  return (
    <>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Deploy Contract</Heading>
          <Text fontStyle="italic" maxW="container.md">
            Welcome to the new thirdweb contract deployment flow.
            <br />
            <Link
              color="blue.500"
              isExternal
              href="https://portal.thirdweb.com/deploy"
            >
              Learn more about deploying your contracts.
            </Link>
          </Text>
        </Flex>

        <DeployableContractTable contractIds={ipfsHashes} context="deploy" />
      </Flex>
    </>
  );
};

ContractsDeployPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

ContractsDeployPage.pageId = PageId.DeployMultiple;

export default ContractsDeployPage;
