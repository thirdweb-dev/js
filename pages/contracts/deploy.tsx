import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import { useMemo } from "react";
import { Badge, Heading, Text } from "tw-components";

const ContractsDeployPage: ConsolePage = () => {
  const { Track } = useTrack({
    page: "deploy",
  });

  const router = useRouter();

  const ipfsHashes = useMemo(() => {
    const uri = router.query.uri;
    const ipfs = router.query.ipfs;
    let array: string[] = [];
    // handle both ipfs and uri
    if (ipfs) {
      array = Array.isArray(ipfs) ? ipfs : [ipfs];
    } else if (uri) {
      array = (Array.isArray(uri) ? uri : [uri]).map((hash) =>
        hash.replace("ipfs://", ""),
      );
    }
    return array;
  }, [router.query]);

  return (
    <Track>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">
            Deploy Contract{" "}
            <Badge variant="outline" colorScheme="purple">
              beta
            </Badge>
          </Heading>
          <Text fontStyle="italic" maxW="container.md">
            Welcome to the new thirdweb contract deployment flow.
            <br />
            <Link
              color="primary.500"
              isExternal
              href="https://www.notion.so/thirdweb/Alpha-Custom-Contract-74d81faa569b418f9ed718645fd7df2c"
            >
              Learn more about deploying custom contracts.
            </Link>
          </Text>
        </Flex>

        <DeployableContractTable contractIds={ipfsHashes} />
      </Flex>
    </Track>
  );
};

ContractsDeployPage.Layout = AppLayout;

export default ContractsDeployPage;
