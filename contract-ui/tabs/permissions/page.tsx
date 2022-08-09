import { Permissions } from "./components";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ContractWithRoles } from "contract-ui/types/types";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractPermissionsPageProps {
  contractAddress?: string;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  const detectedFeature = detectPermissions(contract.contract as SmartContract);

  if (contract.isLoading) {
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
              href="https://portal.thirdweb.com/contracts-sdk/contract-extensions/permissions#permissions-enumerable"
            >
              Permissions Enumerable
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Permissions contract={contract.contract as SmartContract} />
    </Flex>
  );
};

export function detectPermissions(contract: ContractWithRoles) {
  if (!contract) {
    return undefined;
  }
  if ("roles" in contract) {
    return contract.roles;
  }
  return undefined;
}
