import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractDeployForm } from "components/contract-components/contract-deploy-form";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ConsolePage } from "pages/_app";
import { Badge, Card, Heading, Text } from "tw-components";

const ContractsDeployPage: ConsolePage = () => {
  const { Track } = useTrack({
    page: "deploy",
  });
  const contract = useSingleQueryParam("contract");
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
        <Card>
          <ContractDeployForm contractId={contract || ""} />
        </Card>
      </Flex>
    </Track>
  );
};

ContractsDeployPage.Layout = AppLayout;

export default ContractsDeployPage;
