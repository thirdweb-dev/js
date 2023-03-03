import { PasteInput } from "./PasteInput";
import { Flex, FormControl } from "@chakra-ui/react";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { useMemo } from "react";
import { FormLabel, Heading, Link, Text } from "tw-components";

export const FactoryFieldset = () => {
  const configuredChains = useConfiguredChains();

  const { mainnets, testnets } = useMemo(() => {
    return {
      mainnets: configuredChains.filter((n) => !n.testnet),
      testnets: configuredChains.filter((n) => n.testnet),
    };
  }, [configuredChains]);

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
        {mainnets.map(({ chainId, name }) => (
          <FormControl key={`factory${chainId}`}>
            <Flex gap={4} alignItems="center">
              <FormLabel
                mb={2}
                width={{ base: "150px", md: "270px" }}
                lineHeight="150%"
              >
                {name}
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
        {testnets.map(({ chainId, name }) => (
          <FormControl key={`factory${chainId}`}>
            <Flex gap={4} alignItems="center">
              <FormLabel
                mb={2}
                width={{ base: "150px", md: "270px" }}
                lineHeight="150%"
              >
                {name}
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
