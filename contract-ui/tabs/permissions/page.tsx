import { Permissions } from "./components";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractPermissionsPageProps {
  contractAddress?: string;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);

  const detectedFeature = detectFeatures(contractQuery.contract, [
    "Permissions",
  ]);
  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedFeature) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Permissions Enumerable enabled</Heading>
        <Text>
          To enable Permissions features you will have to extend the required
          interfaces in your contract.
        </Text>

        <Divider my={1} />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/extensions/permissions#permissions-enumerable-contract"
            >
              Permissions Enumerable
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
