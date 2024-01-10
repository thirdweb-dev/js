import { Permissions } from "./components";
import { ButtonGroup, Code, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { useTabHref } from "contract-ui/utils";
import { useEffect } from "react";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";

interface ContractPermissionsPageProps {
  contractAddress?: string;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({ contractAddress }) => {
  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const contractQuery = useContract(contractAddress);
  const explorerHref = useTabHref("explorer");

  const detectedEnumerable = detectFeatures(contractQuery.contract, [
    "PermissionsEnumerable",
  ]);
  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedEnumerable) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">
          Missing PermissionsEnumerable Extension
        </Heading>
        <Text>
          This contract does not support the <Code>PermissionsEnumerable</Code>{" "}
          extension.
          <br />
          As a result, you can only view and manage basic permissions via the{" "}
          <Link href={explorerHref} color="primary.500">
            Explorer
          </Link>{" "}
          at the moment.
        </Text>

        <Divider my={1} />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/contracts/build/extensions/general/Permissions"
            >
              Permissions
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }
  if (!contractQuery.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      <Permissions contract={contractQuery.contract} />
    </Flex>
  );
};
