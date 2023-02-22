import { PasteInput } from "./PasteInput";
import { useWeb3 } from "@3rdweb-sdk/react";
import { Flex, FormControl } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk";
import { useMemo } from "react";
import { FormLabel, Heading, Link, Text } from "tw-components";

export const FactoryFieldset = () => {
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
    <Flex gap={16} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.lg">Factory deploy settings</Heading>
        <Text fontStyle="normal">
          Factory deployment requires having deployed implementations of your
          contract already available on each chain you want to support. If you
          already have a contract address, paste it into the corresponding
          network. Your contracts will need to implement the IContract
          interface.{" "}
          <Link
            href="https://portal.thirdweb.com/publish#factory-deploys"
            color="blue.600"
          >
            Learn more
          </Link>
          .
        </Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Heading size="title.md">Mainnets</Heading>
        {mainnets.map(({ chainId, chainName }) => (
          <FormControl key={`factory${chainId}`}>
            <Flex gap={4} alignItems="center">
              <FormLabel
                mb={2}
                width={{ base: "150px", md: "270px" }}
                lineHeight="150%"
              >
                {chainName}
              </FormLabel>
              <PasteInput
                formKey={`factoryDeploymentData.factoryAddresses.${chainId}`}
              />
            </Flex>
          </FormControl>
        ))}
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Heading size="title.md">Testnets</Heading>
        {testnets.map(({ chainId, chainName }) => (
          <FormControl key={`factory${chainId}`}>
            <Flex gap={4} alignItems="center">
              <FormLabel
                mb={2}
                width={{ base: "150px", md: "270px" }}
                lineHeight="150%"
              >
                {chainName}
              </FormLabel>
              <PasteInput
                formKey={`factoryDeploymentData.factoryAddresses.${chainId}`}
              />
            </Flex>
          </FormControl>
        ))}
      </Flex>
    </Flex>
  );
};
