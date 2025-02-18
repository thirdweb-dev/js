import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type React from "react";
import type { ThirdwebClient } from "thirdweb";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { AccountButton } from "./account-button.client";

export function SecondaryNav(props: {
  account: Pick<Account, "email" | "id">;
  logout: () => void;
  connectButton: React.ReactNode;
  client: ThirdwebClient;
  accountAddress: string;
}) {
  return (
    <div className="flex items-center gap-6">
      <SecondaryNavLinks />
      <AccountButton
        logout={props.logout}
        connectButton={props.connectButton}
        account={props.account}
        client={props.client}
        accountAddress={props.accountAddress}
      />
    </div>
  );
}

export function SecondaryNavLinks() {
  return (
    <div className="flex items-center gap-6">
      <ResourcesDropdownButton />

      <Link
        href="https://portal.thirdweb.com"
        className="text-muted-foreground text-sm hover:text-foreground"
        target="_blank"
      >
        Docs
      </Link>

      <Link
        target="_blank"
        href="/support"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        Support
      </Link>

      <Link
        target="_blank"
        href="https://feedback.thirdweb.com"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        Feedback
      </Link>
    </div>
  );
}
