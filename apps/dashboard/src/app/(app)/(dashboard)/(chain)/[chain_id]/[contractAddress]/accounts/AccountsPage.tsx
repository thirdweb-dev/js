"use client";

import type { ThirdwebContract } from "thirdweb";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { AccountsTable } from "./components/accounts-table";
import { CreateAccountButton } from "./components/create-account-button";

export function AccountsPage(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  return (
    <div>
      <div className="flex flex-col md:justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            Accounts
          </h1>
          <p className="text-sm text-muted-foreground">
            View list of smart accounts that have been created for this
            contract.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/transactions/sponsor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about gas sponsorship
            </UnderlineLink>
          </p>
        </div>
        <CreateAccountButton
          contract={props.contract}
          isLoggedIn={props.isLoggedIn}
        />
      </div>

      <div className="h-5" />

      <AccountsTable
        contract={props.contract}
        projectMeta={props.projectMeta}
      />
    </div>
  );
}
