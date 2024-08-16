import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Box, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contractAddress?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const configuredChainsRecord = useSupportedChainsRecord();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;

  const symbol = chain?.nativeCurrency.symbol || "Native Token";

  const detectedFeature = extensionDetectedState({
    contractQuery,
    feature: ["Account"],
  });

  if (contractQuery.isLoading) {
    return null;
  }

  if (!detectedFeature) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Account extension enabled</Heading>
        <Text>This contract is not a smart account.</Text>
        <Box>
          <LinkButton
            isExternal
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-4337/SmartWallet"
            colorScheme="purple"
          >
            Learn more
          </LinkButton>
        </Box>
      </Card>
    );
  }

  const contract = contractQuery.contract;

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Balances</Heading>
      </Flex>
      {contract && (
        <AccountBalance
          address={contract.getAddress()}
          chainId={contract.chainId}
        />
      )}
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Deposit {symbol}</Heading>
      </Flex>

      {chain && contractAddress && (
        <DepositNative
          address={contractAddress}
          symbol={symbol}
          chain={chain}
        />
      )}

      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">NFTs owned</Heading>
      </Flex>
      <NftsOwned address={contractAddress || ""} />
    </Flex>
  );
};
