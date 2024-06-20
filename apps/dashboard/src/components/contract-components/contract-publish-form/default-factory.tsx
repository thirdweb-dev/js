import { AbiSelector } from "./abi-selector";
import { NetworksFieldset } from "./networks-fieldset";
import { Flex, FormControl, ListItem, UnorderedList } from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { useFormContext } from "react-hook-form";
import { Heading, Link, Text } from "tw-components";
import { DynamicContractsFieldset } from "./dynamic-contract-fieldset";

interface DefaultFactoryProps {
  abi: Abi;
  shouldShowDynamicFactoryInput: boolean;
}

export const DefaultFactory: React.FC<DefaultFactoryProps> = ({
  abi,
  shouldShowDynamicFactoryInput,
}) => {
  const form = useFormContext();

  return (
    <Flex px={0} pb={0} flexDir="column" gap={12}>
      <UnorderedList>
        <Text as={ListItem}>
          Default factory lets users deploy your contract to{" "}
          <strong>any EVM network</strong>.
        </Text>
        <Text as={ListItem}>
          The factory deploys EIP-1167 minimal proxies of your contract. This
          makes it much cheaper to deploy.
        </Text>
        <Text as={ListItem}>
          The factory is{" "}
          <Link
            color="primary.500"
            isExternal
            href="https://github.com/thirdweb-dev/contracts/blob/main/contracts/TWStatelessFactory.sol"
          >
            open-source
          </Link>
          , permissionless, and does not alter contract ownership.
        </Text>
        <Text as={ListItem}>
          Your contract needs to be written in the upgradeable/initializable
          pattern. It needs to contain an initializer function.
        </Text>
      </UnorderedList>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Initializer function</Heading>
          <Text>
            Choose the initializer function to invoke on your proxy contracts.
          </Text>
        </Flex>
        <FormControl isRequired>
          <AbiSelector
            defaultValue="initialize"
            abi={abi}
            value={form.watch(
              `factoryDeploymentData.implementationInitializerFunction`,
            )}
            onChange={(selectedFn) =>
              form.setValue(
                `factoryDeploymentData.implementationInitializerFunction`,
                selectedFn,
              )
            }
          />
        </FormControl>
      </Flex>
      <NetworksFieldset />
      {shouldShowDynamicFactoryInput && <DynamicContractsFieldset />}
    </Flex>
  );
};
