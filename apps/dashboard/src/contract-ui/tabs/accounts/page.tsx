import { thirdwebClient } from "@/constants/client";
import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { getContract } from "thirdweb";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedLinkButton,
} from "tw-components";
import { AccountsCount } from "./components/accounts-count";
import { AccountsTable } from "./components/accounts-table";
import { CreateAccountButton } from "./components/create-account-button";

interface AccountsPageProps {
  contractAddress?: string;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const chain = useV5DashboardChain(contractQuery.contract?.chainId);

  const v5Contract = useMemo(() => {
    if (!contractQuery.contract || !chain) {
      return null;
    }
    return getContract({
      address: contractQuery.contract.getAddress(),
      chain: chain,
      client: thirdwebClient,
    });
  }, [contractQuery.contract, chain]);

  const detectedFeature = extensionDetectedState({
    contractQuery,
    feature: ["AccountFactory"],
  });

  if (contractQuery.isLoading || !v5Contract) {
    return null;
  }

  if (!detectedFeature) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Accounts extension enabled</Heading>
        <Text>
          To enable Accounts factory features you will have to extend an
          interface on your contract.
        </Text>
        <Box>
          <LinkButton
            isExternal
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-4337/SmartWalletFactory"
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
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "left", md: "center" }}
        gap={4}
      >
        <Heading size="title.sm">Accounts</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          <TrackedLinkButton
            category={"smart-wallet"}
            variant={"solid"}
            label="docs-factory-page"
            href="https://portal.thirdweb.com/wallets/smart-wallet/get-started#3-connect-smart-wallets-in-your-application"
            isExternal
          >
            View Documentation
          </TrackedLinkButton>
          <CreateAccountButton contractQuery={contractQuery} />
        </ButtonGroup>
      </Flex>
      <AccountsCount contract={v5Contract} />
      <AccountsTable contract={v5Contract} />
    </Flex>
  );
};
