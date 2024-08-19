import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Box, Flex } from "@chakra-ui/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
  detectedAccountFeature: ExtensionDetectedState;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  contract,
  detectedAccountFeature,
}) => {
  const configuredChainsRecord = useSupportedChainsRecord();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;
  const symbol = chain?.nativeCurrency.symbol || "Native Token";

  if (!detectedAccountFeature) {
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
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Balances</Heading>
      </Flex>
      <AccountBalance contract={contract} />
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Deposit {symbol}</Heading>
      </Flex>

      {chain && (
        <DepositNative
          address={contract.address}
          symbol={symbol}
          chain={chain}
        />
      )}

      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">NFTs owned</Heading>
      </Flex>
      <NftsOwned address={contract.address} />
    </Flex>
  );
};
