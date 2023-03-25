import { DeployFormDrawer } from "../contract-deploy-form/drawer";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormLabel, Heading, Link, Text } from "tw-components";

interface ProxyFieldsetProps {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  contractId: string;
}

export const ProxyFieldset: React.FC<ProxyFieldsetProps> = ({
  setIsDrawerOpen,
  contractId,
}) => {
  const form = useFormContext();
  const configuredChains = useConfiguredChains();

  const { mainnets, testnets } = useMemo(() => {
    return {
      mainnets: configuredChains.filter((n) => !n.testnet),
      testnets: configuredChains.filter((n) => n.testnet),
    };
  }, [configuredChains]);

  return (
    <Flex gap={12} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.lg">Proxy deploy settings</Heading>
        <Text fontStyle="normal">
          Proxy deployment requires having deployed implementations of your
          contract already available on each chain you want to support.{" "}
          <Link
            isExternal
            href="https://portal.thirdweb.com/publish#eip-1967-proxy-contracts"
            color="blue.600"
          >
            Learn more
          </Link>
        </Text>
      </Flex>
      <Flex flexDir="column" gap={16} mt={8}>
        <Flex flexDir="column" gap={4}>
          <Heading size="title.md">Mainnets</Heading>
          {mainnets.map(({ chainId, name }) => (
            <FormControl key={`implementation${chainId}`}>
              <Flex gap={4} alignItems="center">
                <FormLabel
                  mb={2}
                  width={{ base: "150px", md: "270px" }}
                  lineHeight="150%"
                >
                  {name}
                </FormLabel>
                <Input
                  placeholder="0x..."
                  {...form.register(
                    `factoryDeploymentData.implementationAddresses.${chainId}`,
                  )}
                />
                <DeployFormDrawer
                  contractId={contractId}
                  chainId={chainId as SUPPORTED_CHAIN_ID}
                  onSuccessCallback={(contractAddress) => {
                    form.setValue(
                      `factoryDeploymentData.implementationAddresses.${chainId}`,
                      contractAddress,
                    );
                  }}
                  onDrawerVisibilityChanged={(visible) => {
                    setIsDrawerOpen(visible);
                  }}
                  isImplementationDeploy
                  onlyIcon
                />
              </Flex>
            </FormControl>
          ))}
        </Flex>
        <Flex flexDir="column" gap={4}>
          <Heading size="title.md">Testnets</Heading>
          {testnets.map(({ chainId, name }) => (
            <FormControl key={`implementation${chainId}`}>
              <Flex gap={4} alignItems="center">
                <FormLabel
                  mb={2}
                  width={{ base: "150px", md: "270px" }}
                  lineHeight="150%"
                >
                  {name}
                </FormLabel>
                <Input
                  placeholder="0x..."
                  {...form.register(
                    `factoryDeploymentData.implementationAddresses.${chainId}`,
                  )}
                />
                <DeployFormDrawer
                  contractId={contractId}
                  chainId={chainId as SUPPORTED_CHAIN_ID}
                  onSuccessCallback={(contractAddress) => {
                    form.setValue(
                      `factoryDeploymentData.implementationAddresses.${chainId}`,
                      contractAddress,
                    );
                  }}
                  onDrawerVisibilityChanged={(visible) => {
                    setIsDrawerOpen(visible);
                  }}
                  isImplementationDeploy
                  onlyIcon
                />
              </Flex>
            </FormControl>
          ))}
        </Flex>

        <Flex flexDir="column" gap={4}>
          <Flex flexDir="column" gap={2}>
            <Heading size="title.md">Initializer function</Heading>
            <Text>
              Choose the initializer function to invoke on your proxy contracts.
            </Text>
          </Flex>
          <FormControl isRequired>
            {/** TODO this should be a selector of ABI functions **/}
            <Input
              value={
                form.watch(
                  `factoryDeploymentData.implementationInitializerFunction`,
                )?.name
              }
              onChange={(e) =>
                form.setValue(
                  `factoryDeploymentData.implementationInitializerFunction`,
                  e.target.value,
                )
              }
              placeholder="function name to invoke"
              defaultValue="initialize"
            />
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
};
