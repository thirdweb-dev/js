"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { Heading, TrackedLinkButton } from "tw-components";
import { AccountsCount } from "./components/accounts-count";
import { AccountsTable } from "./components/accounts-table";
import { CreateAccountButton } from "./components/create-account-button";

interface AccountsPageProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  contract,
  twAccount,
}) => {
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
            category="smart-wallet"
            variant="solid"
            label="docs-factory-page"
            href="https://portal.thirdweb.com/wallets/smart-wallet/get-started#3-connect-smart-wallets-in-your-application"
            isExternal
          >
            View Documentation
          </TrackedLinkButton>
          <CreateAccountButton contract={contract} twAccount={twAccount} />
        </ButtonGroup>
      </Flex>
      <AccountsCount contract={contract} />
      <AccountsTable contract={contract} />
    </Flex>
  );
};
