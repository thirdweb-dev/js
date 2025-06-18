"use client";

import { ButtonGroup, Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { Heading, LinkButton } from "tw-components";
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
          <LinkButton
            variant="solid"
            href="https://portal.thirdweb.com/wallets/smart-wallet/get-started#3-connect-smart-wallets-in-your-application"
            isExternal
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
