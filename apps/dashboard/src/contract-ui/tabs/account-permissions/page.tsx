import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { AccountSigners } from "./components/account-signers";

interface AccountPermissionsPageProps {
  contract: ThirdwebContract;
}

export const AccountPermissionsPage: React.FC<AccountPermissionsPageProps> = ({
  contract,
}) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Account Signers</Heading>
      </Flex>
      <AccountSigners contract={contract} />
    </Flex>
  );
};
