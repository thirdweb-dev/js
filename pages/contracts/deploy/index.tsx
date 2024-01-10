import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
// import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo } from "react";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

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
            Welcome to the thirdweb contract deployment flow.
            <br />
            <Link
              color="blue.500"
              isExternal
              href="https://portal.thirdweb.com/contracts/deploy/overview"
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

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ContractsDeployPage.getLayout = function getLayout(page, props) {
  return <AppLayout {...props}>{page}</AppLayout>;
};

ContractsDeployPage.pageId = PageId.DeployMultiple;

export default ContractsDeployPage;
