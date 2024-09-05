import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
}

export const AccountPage: React.FC<AccountPageProps> = ({ contract }) => {
  const configuredChainsRecord = useSupportedChainsRecord();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;
  const symbol = chain?.nativeCurrency.symbol || "Native Token";

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
      <NftsOwned contract={contract} />
    </Flex>
  );
};
