import { DeployFormDrawer } from "../contract-deploy-form/drawer";
import { PasteInput } from "./PasteInput";
import { useWeb3 } from "@3rdweb-sdk/react";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk";
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
  const { getNetworkMetadata } = useWeb3();

  const { mainnets, testnets } = useMemo(() => {
    const networks = SUPPORTED_CHAIN_IDS.map((supportedChain) => {
      return getNetworkMetadata(supportedChain);
    });

    return {
      mainnets: networks.filter((n) => !n.isTestnet),
      testnets: networks.filter((n) => n.isTestnet),
    };
  }, [getNetworkMetadata]);

  return (
    <Flex gap={12} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.lg">Proxy deploy settings</Heading>
        <Text fontStyle="normal">
          Proxy deployment requires having deployed implementations of your
          contract already available on each chain you want to support.{" "}
          <Link
            isExternal
            href="https://portal.thirdweb.com/release#eip-1967-proxy-contracts"
          >
            Learn more
          </Link>
        </Text>
      </Flex>
      <Flex flexDir="column" gap={16} mt={8}>
        <Flex flexDir="column" gap={4}>
          <Heading size="title.md">Mainnets</Heading>
          {mainnets.map(({ chainId, chainName }) => (
            <FormControl key={`implementation${chainId}`}>
              <Flex gap={4} alignItems="center">
                <FormLabel
                  mb={2}
                  width={{ base: "150px", md: "270px" }}
                  lineHeight="150%"
                >
                  {chainName}
                </FormLabel>
                <PasteInput
                  formKey={`factoryDeploymentData.implementationAddresses.${chainId}`}
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
          {testnets.map(({ chainId, chainName }) => (
            <FormControl key={`implementation${chainId}`}>
              <Flex gap={4} alignItems="center">
                <FormLabel
                  mb={2}
                  width={{ base: "150px", md: "270px" }}
                  lineHeight="150%"
                >
                  {chainName}
                </FormLabel>
                <PasteInput
                  formKey={`factoryDeploymentData.implementationAddresses.${chainId}`}
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
              {...form.register(
                `factoryDeploymentData.implementationInitializerFunction`,
                { required: true },
              )}
              placeholder="function name to invoke"
              defaultValue="initialize"
            />
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
};
