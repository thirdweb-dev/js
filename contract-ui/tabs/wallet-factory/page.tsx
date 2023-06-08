import { CreateWalletButton } from "./components/create-wallet-button";
import { SmartWalletsTable } from "./components/smart-wallets-table";
import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { useContract, useSmartWallets } from "@thirdweb-dev/react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractSmartWalletFactoryProps {
  contractAddress?: string;
}

export const SmartWalletFactoryPage: React.FC<
  ContractSmartWalletFactoryProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);
  const smartWalletsQuery = useSmartWallets(contractQuery?.contract);

  if (contractQuery.isLoading) {
    return null;
  }

  if (!contractQuery?.contract) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">
          No Smart Wallet Factory extension enabled
        </Heading>
        <Text>
          To enable Smart Wallet factory features you will have to extend an
          interface on your contract.
        </Text>
        <Box>
          <LinkButton
            isExternal
            href="https://portal.thirdweb.com/solidity/extensions/base-account-factory"
            colorScheme="purple"
          >
            Learn more
          </LinkButton>
        </Box>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Smart Wallet Factory</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          <CreateWalletButton contractQuery={contractQuery} />
        </ButtonGroup>
      </Flex>
      <SmartWalletsTable smartWalletsQuery={smartWalletsQuery} />
    </Flex>
  );
};
