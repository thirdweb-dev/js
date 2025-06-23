"use client";

import { ButtonGroup, Flex } from "@chakra-ui/react";
import { LinkButton } from "chakra/button";
import { Heading } from "chakra/heading";
import type { ThirdwebContract } from "thirdweb";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { AccountsCount } from "./components/accounts-count";
import { AccountsTable } from "./components/accounts-table";
import { CreateAccountButton } from "./components/create-account-button";

interface AccountsPageProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  contract,
  isLoggedIn,
  projectMeta,
}) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex
        align={{ base: "left", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        justify="space-between"
      >
        <Heading size="title.sm">Accounts</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          <LinkButton
            href="https://portal.thirdweb.com/wallets/smart-wallet/get-started#3-connect-smart-wallets-in-your-application"
            isExternal
            variant="solid"
          >
            View Documentation
          </LinkButton>
          <CreateAccountButton contract={contract} isLoggedIn={isLoggedIn} />
        </ButtonGroup>
      </Flex>
      <AccountsCount contract={contract} />
      <AccountsTable contract={contract} projectMeta={projectMeta} />
    </Flex>
  );
};
