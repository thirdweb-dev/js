import { Box, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { AccountSigners } from "./components/account-signers";

interface AccountPermissionsPageProps {
  contractAddress?: string;
}

export const AccountPermissionsPage: React.FC<AccountPermissionsPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);

  const detectedFeature = extensionDetectedState({
    contractQuery,
    feature: ["AccountPermissions", "AccountPermissionsV1"],
  });

  const chain = useV5DashboardChain(contractQuery.contract?.chainId);

  if (contractQuery.isLoading || !contractQuery.contract || !chain) {
    return null;
  }

  const contract = getContract({
    address: contractQuery.contract.getAddress(),
    chain,
    client: thirdwebClient,
  });

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

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Account Signers</Heading>
      </Flex>
      <AccountSigners contract={contract} />
    </Flex>
  );
};
