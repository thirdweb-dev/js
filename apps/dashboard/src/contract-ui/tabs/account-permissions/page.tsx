import { Box, Flex } from "@chakra-ui/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { AccountSigners } from "./components/account-signers";

interface AccountPermissionsPageProps {
  contract: ThirdwebContract;
  detectedPermissionFeature: ExtensionDetectedState;
}

export const AccountPermissionsPage: React.FC<AccountPermissionsPageProps> = ({
  contract,
  detectedPermissionFeature,
}) => {
  if (!detectedPermissionFeature) {
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
